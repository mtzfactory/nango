export interface Job {
    id?: number;
    sync_id: number;
    sync_friendly_name?: string | undefined;
    started_at: Date;
    ended_at?: Date;
    status: string;
    error_message?: string;
    raw_error?: string;
    attempt?: number | undefined;
    added_count?: number;
    updated_count?: number;
    deleted_count?: number;
    unchanged_count?: number;
    fetched_count?: number;
    page_count?: number;
    info?: Object;
}

export enum JobStatus {
    RUNNING = 'running',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed'
}
