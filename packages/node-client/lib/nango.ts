import axios from 'axios';

export enum NangoHttpMethod {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

export interface NangoSyncConfig {
    base_url?: string;
    method?: NangoHttpMethod;
    headers?: Record<string, string | number | boolean>;
    body?: object;
    query_params?: Record<string, string | number | boolean>;
    unique_key?: string;
    response_path?: string;
    paging_cursor_request_path?: string;
    paging_cursor_metadata_response_path?: string;
    paging_cursor_object_response_path?: string;
    paging_url_path?: string;
    paging_header_link_rel?: string;
    auto_mapping?: boolean;
    frequency?: number;
    pizzly_connection_id?: string;
    pizzly_provider_config_key?: string;
    max_total?: number;
    friendly_name?: string;
    metadata?: Record<string, string | number | boolean>;
}

export class Nango {
    serverUrl: string;

    constructor(serverUrl?: string) {
        this.serverUrl = serverUrl || 'http://localhost:3003';
    }

    async sync(url: string, config?: NangoSyncConfig) {
        config = config || {};
        config.method = config.method || NangoHttpMethod.GET;
        config.base_url = this.serverUrl;

        let nango_req_url = `${config.base_url}/v1/syncs`;

        let nango_req_headers = {
            'Content-Type': 'application/json'
        };

        let nango_req_body = {
            url: url,
            method: config.method,
            headers: config.headers,
            body: config.body,
            query_params: config.query_params,
            unique_key: config.unique_key,
            response_path: config.response_path,
            paging_cursor_request_path: config.paging_cursor_request_path,
            paging_cursor_metadata_response_path: config.paging_cursor_metadata_response_path,
            paging_cursor_object_response_path: config.paging_cursor_object_response_path,
            paging_url_path: config.paging_url_path,
            paging_header_link_rel: config.paging_header_link_rel,
            auto_mapping: config.auto_mapping,
            frequency: config.frequency,
            pizzly_connection_id: config.pizzly_connection_id,
            pizzly_provider_config_key: config.pizzly_provider_config_key,
            max_total: config.max_total,
            friendly_name: config.friendly_name,
            metadata: config.metadata
        };

        return await axios.post(nango_req_url, nango_req_body, { headers: nango_req_headers });
    }
}
