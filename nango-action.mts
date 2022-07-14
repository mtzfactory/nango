import type { HttpHeader, HttpParams, NangoConfig, NangoConnection, NangoIntegrationConfig } from "./nango-types.mjs";
import type * as winston from 'winston';
import type { Axios, AxiosResponse, Method } from 'axios';
import { NangoCallAuthModes } from './nango-types.mjs';
import axios from 'axios';

class NangoAction {

    private nangoConfig: NangoConfig;
    private integrationConfig: NangoIntegrationConfig;
    private userConnection: NangoConnection;
    private axiosInstance: Axios;

    protected logger: winston.Logger;

    public constructor(nangoConfig: NangoConfig, integrationConfig: NangoIntegrationConfig, userConnection: NangoConnection, logger: winston.Logger) {
        this.nangoConfig = nangoConfig;
        this.integrationConfig = integrationConfig;
        this.userConnection = userConnection;
        this.logger = logger;

        this.axiosInstance = new axios.Axios({
            timeout: (this.integrationConfig.http_request_timeout_seconds) ? this.integrationConfig.http_request_timeout_seconds * 1000 : this.nangoConfig.default_http_request_timeout_seconds * 1000
        });
    }

    protected getCurrentConnectionConfig() {
        return this.userConnection;
    }

    protected async httpRequest(endpoint: string, method: Method, params?: HttpParams, body?: any, headers?: HttpHeader) {
        const fullURL = new URL(endpoint, this.integrationConfig.base_url).href;

        let finalHeaders: HttpHeader = {};
        if (headers !== undefined) {
            finalHeaders = headers;
        }

        let finalParams: HttpParams = {};
        if (params !== undefined) {
            finalParams = params;
        }

        if (this.integrationConfig.call_auth.mode === NangoCallAuthModes.AUTH_HEADER_TOKEN) {
            finalHeaders['Authorization'] = `Bearer ${this.userConnection.oAuthAccessToken}`;
        }

        let serializedBody: string;
        if (typeof body === 'object') {
            serializedBody = JSON.stringify(body);
            finalHeaders['Content-Type'] = 'application/json';
        } else {
            serializedBody = body;
        }

        this.logger.debug(`HTTP call - URL: ${fullURL}\nHeader: ${JSON.stringify(finalHeaders)}\n`);

        const promise = new Promise<AxiosResponse<any, any>>((resolve, reject) => {
            
            this.axiosInstance.request({
                url: fullURL,
                method: method,
    
                params: finalParams,
                headers: finalHeaders,
    
                data: serializedBody
            })
            .then((result) => {
                this.logger.debug(`HTTP result: ${result.data}`);
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });

        });

        return promise;
    }   
    
    public async executeAction(input: any): Promise<any> {
        console.log(`Default NangoAction - executeAction has been called. This is probably not what you intended. Passed input:\n${JSON.stringify(input)}`);
        return;
    }
}

export { NangoAction };