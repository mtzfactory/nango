export interface Sync {
    id?: number;
    created_at?: Date;
    updated_at?: Date;
    url: string;
    method: string;
    headers?: { string: string | number | boolean };
    body?: object;
    unique_key: string;
    response_path?: string;
    paging_request_path?: string;
    paging_response_path?: string;
    paging_url_path?: string;
    paging_header_link_rel?: string;
    max_total?: number;
}
