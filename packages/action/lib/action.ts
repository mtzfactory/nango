/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import {
    HttpHeader,
    HttpParams,
    NangoConfig,
    NangoConnection,
    NangoIntegrationAuthConfigOAuth1,
    NangoIntegrationAuthModes,
    NangoIntegrationConfig,
    NangoOAuth1Credentials
} from '@nangohq/core';
import * as core from '@nangohq/core';
import type * as winston from 'winston';
import type { Axios, AxiosResponse, Method } from 'axios';
import axios from 'axios';
import oAuth1 from 'oauth';

class NangoAction {
    private nangoConfig: NangoConfig;
    private integrationConfig: NangoIntegrationConfig;
    private userConnection: NangoConnection;
    private axiosInstance: Axios;
    private actionName: string;

    private executionStartTime: [number, number];

    protected logger!: winston.Logger;

    public constructor(
        nangoConfig: NangoConfig,
        integrationConfig: NangoIntegrationConfig,
        userConnection: NangoConnection,
        logger: winston.Logger,
        actionName: string
    ) {
        this.executionStartTime = process.hrtime();

        this.nangoConfig = nangoConfig;
        this.integrationConfig = integrationConfig;
        this.userConnection = userConnection;
        this.logger = logger;
        this.actionName = actionName;

        // Configure Axios
        this.axiosInstance = new axios.Axios({
            timeout: this.integrationConfig.http_request_timeout_seconds
                ? this.integrationConfig.http_request_timeout_seconds * 1000
                : this.nangoConfig.default_http_request_timeout_seconds * 1000
        });

        this.logger.info(`🏁👉 Starting execution of action ${this.userConnection.integration}.${this.actionName}.`);
    }

    // A bit hacky but found no other decent way to get this message logged
    public markExecutionComplete() {
        const elapsedMilliseconds = process.hrtime(this.executionStartTime)[1] / 1000000;
        this.logger.info(`🏁✅ Execution of action finished in ${elapsedMilliseconds.toFixed(3)} ms`);
    }

    protected getCurrentConnection(): NangoConnection {
        return this.userConnection;
    }

    protected async httpRequest(endpoint: string, method: Method, params?: HttpParams, body?: any, headers?: HttpHeader): Promise<AxiosResponse> {
        if (this.integrationConfig.requests.base_url.slice(-1) !== '/') {
            this.integrationConfig.requests.base_url += '/';
        }
        if (endpoint.slice(0, 1) === '/') {
            endpoint = endpoint.substring(1);
        }

        const fullURL = new URL(endpoint, this.integrationConfig.requests.base_url).href;

        const interpolationVariables: Record<string, any> = {};
        if (this.integrationConfig.app_api_key) {
            interpolationVariables['app_api_key'] = this.integrationConfig.app_api_key;
        }

        if (this.integrationConfig.oauth_client_id) {
            interpolationVariables['oauth_client_id'] = this.integrationConfig.oauth_client_id;
        }
        if (this.integrationConfig.oauth_client_secret) {
            interpolationVariables['oauth_client_secret'] = this.integrationConfig.oauth_client_secret;
        }

        // Add credentials variables
        const userCredentials = this.userConnection.credentials;
        switch (userCredentials.type) {
            case NangoIntegrationAuthModes.OAuth2:
                interpolationVariables['access_token'] = userCredentials.accessToken;
                break;
            case NangoIntegrationAuthModes.OAuth1:
                interpolationVariables['oauth_token'] = userCredentials.oAuthToken;
                interpolationVariables['oauth_token_secret'] = userCredentials.oAuthTokenSecret;
                break;
            case NangoIntegrationAuthModes.ApiKey:
                interpolationVariables['api_key'] = userCredentials.apiKey;
                break;
            case NangoIntegrationAuthModes.UsernamePassword:
                interpolationVariables['username'] = userCredentials.username;
                interpolationVariables['password'] = userCredentials.password;
                interpolationVariables['basic_auth_encoded'] = Buffer.from(userCredentials.username + ':' + userCredentials.password).toString('base64');
                break;
        }
        // Add all the top level raw variables as well
        for (const key in userCredentials.raw) {
            interpolationVariables['raw.' + key] = userCredentials.raw[key];
        }

        let finalHeaders: HttpHeader = {};
        if (headers !== undefined) {
            finalHeaders = headers;
        }

        if (this.integrationConfig.requests.headers) {
            for (const headerKey of Object.keys(this.integrationConfig.requests.headers)) {
                finalHeaders[headerKey] = core.interpolateString(this.integrationConfig.requests.headers[headerKey]!, interpolationVariables);
            }
        }

        let finalParams: HttpParams = {};
        if (params !== undefined) {
            finalParams = params;
        }

        if (this.integrationConfig.requests.params) {
            for (const paramsKey of Object.keys(this.integrationConfig.requests.params)) {
                finalHeaders[paramsKey] = core.interpolateString(this.integrationConfig.requests.params[paramsKey]!, interpolationVariables);
            }
        }

        let serializedBody: string;
        if (typeof body === 'object') {
            serializedBody = JSON.stringify(body);
            finalHeaders['Content-Type'] = 'application/json';
        } else {
            serializedBody = body;
        }

        // If the request is for an OAuth1 integration we need to sign it and add a special Authorization header
        // In theory this should be the right auth header for all OAuth1 based APIs, but it turns out some invented their own
        // weird authorization format and skip the request signing (looking at you, Trello). So we only set this if the user has not
        // created any custom Authorization header in the integration config
        if (this.integrationConfig.auth.auth_mode === NangoIntegrationAuthModes.OAuth1 && !finalHeaders['Authorization']) {
            finalHeaders['Authorization'] = this.createOAuth1AuthorizationHeader(method, fullURL, finalParams);
        }

        const promise = new Promise<AxiosResponse<any, any>>((resolve, reject) => {
            const requestId = core.makeId(8);
            this.logger.debug(
                `📡👆 HTTP ${method} request (#${requestId}): ${fullURL}\n\nHeaders:\n${JSON.stringify(finalHeaders, null, 4)}\n\nBody:\n${serializedBody}\n\n`
            );

            this.axiosInstance
                .request({
                    url: fullURL,
                    method: method,

                    params: finalParams,
                    headers: finalHeaders,

                    data: serializedBody
                })
                .then((response) => {
                    let bodyLog = '';

                    if (response.data != null) {
                        try {
                            // Body is JSON.
                            bodyLog = JSON.stringify(JSON.parse(response.data), null, 4);
                        } catch {
                            if (typeof response.data === 'string' && response.data.length > 0) {
                                // Body is not JSON but has been parsed to a string type by Axios.
                                bodyLog = response.data;
                            } else if (typeof response.data === 'string' && response.data.length === 0) {
                                // Body is an empty string.
                                bodyLog = 'Response body is empty.';
                            } else {
                                // Body has an unknown format.
                                bodyLog = 'Could not parse body.';
                            }
                        }
                    } else {
                        // Body is empty.
                        bodyLog = 'Response body is empty.';
                    }

                    const statusHundred = `${response.status}`.slice(0, 1);
                    const statusEmoji = '45'.includes(statusHundred) ? '❌' : statusHundred === '2' ? '✅' : '';

                    this.logger.debug(
                        `📡👇${statusEmoji} ${response.status} HTTP ${method} response (#${requestId}): ${fullURL}\nStatus: ${response.status} - ${
                            response.statusText
                        }\n\nHeaders:\n${JSON.stringify(response.headers, null, 4)}\n\nBody:\n${bodyLog}\n\n`
                    );

                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    public async executeAction(input: any): Promise<any> {
        this.logger.warn(
            `Default NangoAction - executeAction has been called. This is probably not what you intended. Passed input:\n${JSON.stringify(input)}`
        );
        return;
    }

    private createOAuth1AuthorizationHeader(method: Method, url: string, queryParams: any) {
        const authConfig = this.integrationConfig.auth as NangoIntegrationAuthConfigOAuth1;
        const oAuth1Credentials = this.userConnection.credentials as NangoOAuth1Credentials;
        const oAuthToken = oAuth1Credentials.oAuthToken;
        const oAuthTokenSecret = oAuth1Credentials.oAuthTokenSecret;

        const oAuth1Client = new oAuth1.OAuth(
            authConfig.request_url,
            authConfig.token_url,
            this.integrationConfig.oauth_client_id!,
            this.integrationConfig.oauth_client_secret!,
            '1.0A',
            '',
            authConfig.signature_method,
            undefined,
            {}
        );

        // This is pretty much lifted from the oauth library. It works, but don't ask me if there is another/better way :)
        // @ts-ignore
        const orderedParams = oAuth1Client._prepareParameters(oAuthToken, oAuthTokenSecret, method, url, queryParams);
        // @ts-ignore
        return oAuth1Client._buildAuthorizationHeaders(orderedParams);
    }
}

export { NangoAction };
