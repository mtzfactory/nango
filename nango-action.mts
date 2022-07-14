import type { HttpHeader, HttpParams, NangoConfig, NangoConnection, NangoIntegrationConfig } from "./nango-types.mjs";
import * as winston from 'winston';
import type { Axios, AxiosResponse, Method } from 'axios';
import { NangoCallAuthModes } from './nango-types.mjs';
import axios from 'axios';

class NangoAction {

    private nangoConfig: NangoConfig;
    private integrationConfig: NangoIntegrationConfig;
    private userConnection: NangoConnection;
    private axiosInstance: Axios;
    private actionName: string;
    
    private executionStartTime: [number, number];

    protected logger!: winston.Logger;

    public constructor(nangoConfig: NangoConfig, integrationConfig: NangoIntegrationConfig, userConnection: NangoConnection, logPath: string, actionName: string) {
        this.nangoConfig = nangoConfig;
        this.integrationConfig = integrationConfig;
        this.userConnection = userConnection;
        this.actionName = actionName;
        
        this.executionStartTime = process.hrtime();

        this.setupLogger(logPath);
        this.logger.info(`Starting execution of action '${actionName}' in integration '${this.userConnection.integration}' for user_id '${this.userConnection.userId}'`);

        this.axiosInstance = new axios.Axios({
            timeout: (this.integrationConfig.http_request_timeout_seconds) ? this.integrationConfig.http_request_timeout_seconds * 1000 : this.nangoConfig.default_http_request_timeout_seconds * 1000
        });
    }

    // A bit hacky but found no other decent way to get this message logged
    public markExecutionComplete() {
        const elapsedMilliseconds = process.hrtime(this.executionStartTime)[1] / 1000000;
        this.logger.info(`Execution of action finished in ${elapsedMilliseconds.toFixed(3)} ms`);
    }

    private setupLogger(logPath: string) {
        const nangoActionLogFormat = winston.format.printf((info) => {
            return `${info['timestamp']} ${info['level']} [${info['integration']}] [${info['action']}] [user: ${info['userId']}] [execution id #${info['actionExecutionId']}] ${info['message']}`;
        });
        
        this.logger = winston.createLogger({
            level: (this.integrationConfig?.log_level) ? this.integrationConfig.log_level : this.nangoConfig.default_action_log_level,
            defaultMeta: {
                integration: this.userConnection.integration,
                action: this.actionName,
                userId: this.userConnection.userId,
                actionExecutionId: this.makeid(8)
            },
            format: winston.format.combine(
                winston.format.timestamp(),
                nangoActionLogFormat
            ),
            transports: [
                new winston.transports.File({ filename: logPath })
            ]
        });

        if (process.env['NODE_ENV'] !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    nangoActionLogFormat
                )
            }));
        }
    }

    // A helper function to generate IDs that are unique but still humanly readable
    private makeid(length: number) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
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

        const promise = new Promise<AxiosResponse<any, any>>((resolve, reject) => {

            const requestId = this.makeid(8);
            this.logger.debug(`HTTP request #${requestId} - REQUEST\nURL: ${fullURL}\nHeaders:\n${JSON.stringify(finalHeaders, null, 4)}\nBody:\n${serializedBody}`);
            
            this.axiosInstance.request({
                url: fullURL,
                method: method,
    
                params: finalParams,
                headers: finalHeaders,
    
                data: serializedBody
            })
            .then((response) => {
                // TODO: This currently assumes the response.data is JSON, but it could be other data types (which would require other serialization for logging)
                this.logger.debug(`HTTP request #${requestId} - RESPONSE\nStatus: ${response.status} - ${response.statusText}\nHeaders:\n${JSON.stringify(response.headers, null, 4)}\nBody:\n${JSON.stringify(JSON.parse(response.data), null, 4)}`);

                resolve(response);
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