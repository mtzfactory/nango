export interface Sync {
    id: number;
    url: string;
    headers?: object;
    body?: object;
    unique_key: string;
    response_path?: string;
    created_at?: Date;
    updated_at?: Date;
}
