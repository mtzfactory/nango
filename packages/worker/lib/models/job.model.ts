export interface Job {
    id?: number;
    sync_id: number;
    sync_friendly_name?: string | undefined;
    started_at: Date;
    ended_at?: Date;
    status: string;
    error_message?: string;
    total_row_count?: number;
    new_row_count?: number;
    updated_row_count?: number;
    raw_error?: string;
    attempt?: number | undefined;
}

export enum JobStatus {
    RUNNING = 'running',
    SUCCEEDED = 'succeeded',
    FAILED = 'failed'
}
