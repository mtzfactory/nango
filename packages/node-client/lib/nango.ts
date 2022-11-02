import axios from 'axios';

export enum NangoHttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

export interface NangoSyncConfig {
    nango_server?: string;
    nango_port?: string;
    method?: NangoHttpMethod;
    headers?: object;
    body?: object;
    unique_key?: string;
    response_path?: string;
    paging_request_path?: string;
    paging_response_path?: string;
    paging_url_path?: string;
    max_total?: number;
}

export class Nango {
    static async sync(url: string, config?: NangoSyncConfig) {
        config = config || {};
        config.method = config.method || NangoHttpMethod.GET;
        config.nango_server = config.nango_server || 'http://localhost';
        config.nango_port = config.nango_port || '3003';

        let nango_req_url = `${config.nango_server}:${config.nango_port}/v1/syncs`;

        let nango_req_headers = {
            'Content-Type': 'application/json'
        };

        let nango_req_body = {
            url: url,
            method: config.method,
            headers: config.headers,
            body: config.body,
            unique_key: config.unique_key,
            response_path: config.response_path,
            paging_request_path: config.paging_request_path,
            paging_response_path: config.paging_response_path,
            paging_url_path: config.paging_url_path,
            max_total: config.max_total
        };

        return await axios.post(nango_req_url, nango_req_body, { headers: nango_req_headers });
    }
}
