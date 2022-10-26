import type { AxiosRequestHeaders } from 'axios';

export enum HttpMethod {
    Get = 0,
    Post,
    Put,
    Patch,
    Delete
}

export interface Sync {
    id?: number;
    url: string;
    headers?: AxiosRequestHeaders;
    body?: object;
    unique_key: string;
    response_path?: string;
    created_at?: Date;
    updated_at?: Date;
    method: HttpMethod;
    paging_request_path?: string;
    paging_response_path?: string;
}
