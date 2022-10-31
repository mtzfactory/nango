import type { AxiosRequestHeaders } from 'axios';

export interface Sync {
    id?: number;
    url: string;
    headers?: AxiosRequestHeaders;
    body?: object;
    unique_key: string;
    response_path?: string;
    created_at?: Date;
    updated_at?: Date;
    method: string;
    paging_request_path?: string;
    paging_response_path?: string;
    paging_url_path?: string;
    max_total?: number;
}
