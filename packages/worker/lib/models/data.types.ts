export enum NangoColumnDataTypes {
    NUMBER = 'number',
    STRING = 'string',
    DATE = 'date',
    JSON = 'json',
    BOOLEAN = 'boolean',
    UNKNOWN = 'unknown'
}

export class NangoDataTypeMap {
    static PostgreSql = new Map([
            ['integer', NangoColumnDataTypes.NUMBER],
            ['real', NangoColumnDataTypes.NUMBER],
            ['timestamp with time zone', NangoColumnDataTypes.DATE],
            ['character varying', NangoColumnDataTypes.STRING],
            ['text', NangoColumnDataTypes.STRING],
            ['json', NangoColumnDataTypes.JSON],
            ['boolean', NangoColumnDataTypes.BOOLEAN],
        ]);
}

export enum NangoDatabase {
    POSTGRESQL = 'POSTGRESQL',
}