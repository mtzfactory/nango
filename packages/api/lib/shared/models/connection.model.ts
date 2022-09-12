export interface Connection {
    id: number;
    account_id: string;
    integration_type: string;
    access_token?: string;
    created_at?: Date;
    updated_at?: Date;
}
