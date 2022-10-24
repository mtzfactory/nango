import type { AxiosRequestHeaders } from 'axios';

export enum HttpRequestType {
    Get = 1,
    Post,
    Put,
    Patch,
    Delete
}

export interface Sync {
    id: number;
    url: string;
    headers?: AxiosRequestHeaders;
    body?: object;
    unique_key: string;
    response_path?: string;
    created_at?: Date;
    updated_at?: Date;
    request_type: HttpRequestType;
    paging_request_path?: string;
    paging_result_path?: string;
}
