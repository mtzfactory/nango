export interface RawContact {
    raw: any;
    connection_id: number;
    object_type: string;
}

export interface Contact {
    raw_id: number;
    external_id?: string;
    first_name?: string;
    last_name?: string;
    job_title?: string;
    account?: string;
    addresses?: string;
    emails?: string;
    phones?: string;
    last_activity_at?: Date;
    external_created_at?: Date;
    external_modified_at?: Date;
}
