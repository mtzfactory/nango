/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import type { HttpHeader, HttpParams, NangoConfig, NangoConnection, NangoIntegrationConfig } from '@nangohq/core';
import * as core from '@nangohq/core';
import type * as winston from 'winston';
import type { Axios, AxiosResponse, Method } from 'axios';
import axios from 'axios';

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

    protected getCurrentConnectionConfig(): NangoConnection {
        return this.userConnection;
    }

    protected async httpRequest(endpoint: string, method: Method, params?: HttpParams, body?: any, headers?: HttpHeader): Promise<AxiosResponse> {
        if (this.integrationConfig.base_url.slice(-1) !== '/') {
            this.integrationConfig.base_url += '/';
        }
        if (endpoint.slice(0, 1) === '/') {
            endpoint = endpoint.substring(1);
        }

        const fullURL = new URL(endpoint, this.integrationConfig.base_url).href;

        let finalHeaders: HttpHeader = {};
        if (headers !== undefined) {
            finalHeaders = headers;
        }

        let finalParams: HttpParams = {};
        if (params !== undefined) {
            finalParams = params;
        }

        if (this.integrationConfig.call_auth.mode === core.NangoCallAuthModes.AUTH_HEADER_TOKEN) {
            finalHeaders['Authorization'] = `Bearer ${this.userConnection.oAuthAccessToken}`;
        }

        let serializedBody: string;
        if (typeof body === 'object') {
            serializedBody = JSON.stringify(body);
            finalHeaders['Content-Type'] = 'application/json';
        } else {
            serializedBody = body;
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
}

export { NangoAction };
