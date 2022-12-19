export interface RawObject {
    id?: number;
    sync_id: number;
    emitted_at: Date;
    unique_key: string;
    data: object;
    data_hash: string;
    metadata: Record<string, string | number | boolean>;
    deleted_at?: Date | null;
}
