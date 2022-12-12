import { knexDatabase as db, logger } from '@nangohq/core';
import type { RawObject } from '../models/raw_object.model.js';
import type { Sync } from '@nangohq/core';
import _ from 'lodash';
import { NangoColumnDataTypes, NangoDatabase, NangoDataTypeMap } from '../models/data.types.js';
import { v4 as uuidv4 } from 'uuid';

class DataService {
    async upsertRawFromList(objects: RawObject[], sync: Sync): Promise<number> {
        var updatedRowCount: number = 0;

        if (sync.unique_key != null) {
            try {
                // Compute the updated row count for observability.
                let updatedRowCountQueryResult = (
                    await db
                        .knex<RawObject>(`_nango_raw`)
                        .withSchema(db.schema())
                        .count<Record<string, number>>('id')
                        .where('sync_id', sync.id)
                        .whereIn(
                            'unique_key',
                            objects.map((o) => o.unique_key)
                        )
                )[0];
                updatedRowCount = +updatedRowCountQueryResult!['count']!;
            } catch (err) {
                updatedRowCount = 0;
                logger.error(`Could not compute updated row count for job with Sync ${sync.id}): ${JSON.stringify(err)}`);
            }

            // 'unique_key' provided: upsert.
            await db.knex<RawObject>(`_nango_raw`).withSchema(db.schema()).insert(objects).onConflict(['sync_id', 'unique_key']).merge();
        } else {
            // No 'unique_key' provided: delete all and insert.
            await db.knex<RawObject>(`_nango_raw`).withSchema(db.schema()).where('sync_id', sync.id).del();
            await db.knex<RawObject>(`_nango_raw`).withSchema(db.schema()).insert(objects);
        }

        return updatedRowCount;
    }

    async upsertFlatFromList(objects: object[], metadata: Record<string, string | number | boolean> | undefined, sync: Sync): Promise<void | number[]> {
        for (var object of objects) {
            object['_nango_sync_id'] = sync.id!;
            object['_nango_emitted_at'] = new Date();
            object['_nango_unique_key'] = sync.unique_key != null ? _.get(object, sync.unique_key, this.defaultUniqueKey()) : this.defaultUniqueKey();

            Object.assign(object, metadata || {}); // Add the metadata to each row.
        }

        if (sync.unique_key != null) {
            // 'unique_key' provided: upsert.
            return await db.knex<RawObject>(this.tableNameForSync(sync)).insert(objects).onConflict(['_nango_sync_id', '_nango_unique_key']).merge();
        } else {
            // No 'unique_key' provided: delete all and insert.
            await db.knex<RawObject>(this.tableNameForSync(sync)).where('_nango_sync_id', sync.id).del();
            return await db.knex<RawObject>(this.tableNameForSync(sync)).insert(objects);
        }
    }

    async fetchColumnInfo(table: string) {
        let tableInfo = await db.knex(table).columnInfo();

        let schema = {};

        for (var columnInfo in tableInfo) {
            if (tableInfo[columnInfo] != null && tableInfo[columnInfo]!['type'] != null) {
                let dataType = this.sqlToNangoTypeMapping(NangoDatabase.POSTGRESQL, tableInfo[columnInfo]!['type']);
                schema[columnInfo] = dataType;
            }
        }

        return schema;
    }

    sqlToNangoTypeMapping(database: NangoDatabase, sqlType: string): NangoColumnDataTypes {
        let nangoType: NangoColumnDataTypes | undefined;

        switch (database) {
            case NangoDatabase.POSTGRESQL:
                nangoType = NangoDataTypeMap.PostgreSql.get(sqlType);
                break;
            default:
                nangoType = NangoColumnDataTypes.UNKNOWN;
                break;
        }

        if (nangoType) {
            return nangoType;
        } else {
            logger.error(`Unkwown Postgres column type returned from schema: ${sqlType}`);
            return NangoColumnDataTypes.UNKNOWN;
        }
    }

    async updateSyncSchema(newColumns: object, sync: Sync) {
        return db.knex.schema.table(this.tableNameForSync(sync), (t) => {
            for (var colName in newColumns) {
                let type = newColumns[colName];
                switch (type) {
                    case NangoColumnDataTypes.STRING:
                        t.text(colName);
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
                        logger.error(`Attempting to update Sync table schema with unknown data type: ${type} (Sync ID: ${sync.id})`);
                }
            }
        });
    }

    async createSyncTableIfNeeded(sync: Sync) {
        const exists = await db.knex.schema.hasTable(this.tableNameForSync(sync));
        if (!exists) {
            logger.debug(`Table ${this.tableNameForSync(sync)} doesn't exist, creating the new table for Sync ID: ${sync.id}.`);
            await db.knex.schema.createTable(this.tableNameForSync(sync), (t) => {
                t.increments('_nango_id').primary();
                t.integer('_nango_sync_id').references('id').inTable(`${db.schema()}._nango_syncs`);
                t.dateTime('_nango_emitted_at').notNullable();
                t.string('_nango_unique_key');

                if (sync.unique_key != null) {
                    t.unique(['_nango_sync_id', '_nango_unique_key']);
                }
            });
        }
    }

    tableNameForSync(sync: Sync): string {
        return sync.mapped_table || `_nango_sync_${sync.id}`;
    }

    defaultUniqueKey() {
        return 'no-unique-key-' + uuidv4();
    }
}

export default new DataService();
