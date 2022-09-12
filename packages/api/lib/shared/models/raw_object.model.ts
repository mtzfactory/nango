export interface RawObject {
    id?: number;
    raw: object;
    connection_id: number;
    object_type: string;
    created_at?: Date;
    updated_at?: Date;
}
