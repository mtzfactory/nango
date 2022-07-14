import type { HttpHeader, HttpParams, NangoConfig, NangoConnection, NangoIntegrationConfig } from "./nango-types.mjs";
import { NangoCallAuthModes } from './nango-types.mjs';
import type { Axios, Method } from 'axios';
import axios from 'axios';

class NangoAction {

    private nangoConfig: NangoConfig;
    private integrationConfig: NangoIntegrationConfig;
    private userConnection: NangoConnection;
    private axiosInstance: Axios;

    public constructor(nangoConfig: NangoConfig, integrationConfig: NangoIntegrationConfig, userConnection: NangoConnection) {
        this.nangoConfig = nangoConfig;
        this.integrationConfig = integrationConfig;
        this.userConnection = userConnection;
        this.axiosInstance = new axios.Axios({
            timeout: (this.integrationConfig.http_request_timeout_seconds) ? this.integrationConfig.http_request_timeout_seconds * 1000 : this.nangoConfig.default_http_request_timeout_seconds * 1000
        });
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

        console.log(`HTTP call - URL: ${fullURL}\nHeader: ${JSON.stringify(finalHeaders)}\n`);

        const promise = new Promise<any>((resolve, reject) => {
            
            this.axiosInstance.request({
                url: fullURL,
                method: method,
    
                params: finalParams,
                headers: finalHeaders,
    
                data: serializedBody
            })
            .then((result) => {
                console.log(`HTTP result: ${result.data}`);
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });

        });

        return promise;
    }   
    
    public async executeAction(input: any) {
        console.log(`Default NangoAction - executeAction has been called. This is probably not what you intended. Passed input:\n${JSON.stringify(input)}`);
        return;
    }
}

export { NangoAction };