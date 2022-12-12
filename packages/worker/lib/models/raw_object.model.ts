export interface RawObject {
    id?: number;
    sync_id: number;
    emitted_at: Date;
    unique_key: string;
    data: object;
    metadata: Record<string, string | number | boolean>;
}
