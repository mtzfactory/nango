import { knexDatabase as db, logger } from '@nangohq/core';
import type { RawObject } from '../models/raw_object.model.js';
import type { Sync } from '@nangohq/core';
import _ from 'lodash';
import { NangoColumnDataTypes } from '../models/data.types.js';

class DataService {
    async upsertRawFromList(objects: RawObject[], sync: Sync): Promise<void | number[]> {
        if (sync.unique_key != null) {
            // If there is a `unique_key` for deduping rows: upsert, i.e. delete conflicting rows, then write new rows.
            return db
                .knex<RawObject>(`_nango_raw`)
                .where('sync_id', sync.id)
                .whereIn(
                    'unique_key',
                    objects.map((o) => o.unique_key)
                )
                .del()
                .then(() => {
                    return db.knex<RawObject>(`_nango_raw`).insert(objects);
                });
        } else {
            // If no `unique_key` provided: rewrite, i.e. delete all rows for that sync, then write new rows.
            return db
                .knex<RawObject>(`_nango_raw`)
                .where('sync_id', sync.id)
                .del()
                .then(() => {
                    return db.knex<RawObject>(`_nango_raw`).insert(objects);
                });
        }
    }

    async upsertFlatFromList(objects: object[], sync: Sync): Promise<void | number[]> {
        for (var object of objects) {
            object['_nango_sync_id'] = sync.id!;
            object['_nango_emitted_at'] = new Date();
            object['_nango_unique_key'] = sync.unique_key != null ? _.get(object, sync.unique_key, undefined) : undefined;
        }

        if (sync.unique_key != null) {
            // If there is a `unique_key` for deduping rows: upsert, i.e. delete conflicting rows, then write new rows.
            return db
                .knex(this.tableNameForSync(sync.id!))
                .where('_nango_sync_id', sync.id)
                .whereIn(
                    '_nango_unique_key',
                    objects.map((o) => o['_nango_unique_key'])
                )
                .del()
                .then(() => {
                    return db.knex(this.tableNameForSync(sync.id!)).insert(objects);
                });
        } else {
            // If no `unique_key` provided: rewrite, i.e. delete all rows for that sync, then write new rows.
            return db
                .knex(this.tableNameForSync(sync.id!))
                .where('_nango_sync_id', sync.id)
                .del()
                .then(() => {
                    return db.knex(this.tableNameForSync(sync.id!)).insert(objects);
                });
        }
    }

    async fetchColumnInfo(table: string) {
        return db
            .knex(table)
            .columnInfo()
            .then((tableInfo) => {
                let schema = {};

                for (var columnInfo in tableInfo) {
                    if (tableInfo[columnInfo] != null && tableInfo[columnInfo]!['type'] != null) {
                        let dataType = this.sqlToNangoTypeMapping(tableInfo[columnInfo]!['type']);
                        schema[columnInfo] = dataType;
                    }
                }

                return schema;
            });
    }

    sqlToNangoTypeMapping(sqlType: string) {
        switch (sqlType) {
            case 'integer':
                return NangoColumnDataTypes.NUMBER;
            case 'real':
                return NangoColumnDataTypes.NUMBER;
            case 'timestamp with time zone':
                return NangoColumnDataTypes.DATE;
            case 'character varying':
                return NangoColumnDataTypes.STRING;
            case 'json':
                return NangoColumnDataTypes.JSON;
            case 'boolean':
                return NangoColumnDataTypes.BOOLEAN;
            default:
                logger.error(`Unkwown Postgres column type returned from schema: ${sqlType}`);
                return NangoColumnDataTypes.UNKNOWN;
        }
    }

    async updateSyncSchema(newColumns: object, syncId: number) {
        return db.knex.schema.table(this.tableNameForSync(syncId), (t) => {
            for (var colName in newColumns) {
                let type = newColumns[colName];
                switch (type) {
                    case NangoColumnDataTypes.STRING:
                        t.string(colName);
                        break;
                    case NangoColumnDataTypes.NUMBER:
                        t.float(colName);
                        break;
                    case NangoColumnDataTypes.JSON:
                        t.json(colName);
                        break;
                    case NangoColumnDataTypes.DATE:
                        t.dateTime(colName);
                        break;
                    case NangoColumnDataTypes.BOOLEAN:
                        t.boolean(colName);
                        break;
                    default:
                        logger.error(`Attempting to update Sync table schema with unknown data type: ${type} (Sync ID: ${syncId})`);
                }
            }
        });
    }

    async createSyncTableIfNeeded(syncId: number) {
        return new Promise<void>((resolve, reject) => {
            db.knex.schema
                .hasTable(this.tableNameForSync(syncId))
                .then((exists) => {
                    if (!exists) {
                        logger.debug(`Table ${this.tableNameForSync(syncId)} doesn't exist, creating the new table for Sync ID: ${syncId}.`);
                        db.knex.schema
                            .createTable(this.tableNameForSync(syncId), (t) => {
                                t.increments('_nango_id').primary();
                                t.integer('_nango_sync_id').references('id').inTable('_nango_syncs');
                                t.dateTime('_nango_emitted_at').notNullable();
                                t.string('_nango_unique_key');
                            })
                            .then(() => {
                                resolve();
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else {
                        resolve();
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    tableNameForSync(syncId: number): string {
        return `_nango_sync_${syncId}`;
    }
}

export default new DataService();
