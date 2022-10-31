import type { AxiosRequestHeaders } from 'axios';

export interface Sync {
    id?: number;
    created_at?: Date;
    updated_at?: Date;
    url: string;
    method: string;
    headers?: AxiosRequestHeaders;
    body?: object;
    unique_key: string;
    response_path?: string;
    paging_request_path?: string;
    paging_response_path?: string;
    paging_url_path?: string;
    max_total?: number;
}
