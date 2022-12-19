import { knexDatabase as db, logger } from '@nangohq/core';
import type { RawObject } from '../models/raw_object.model.js';
import type { Sync } from '@nangohq/core';
import _ from 'lodash';
import { NangoColumnDataTypes, NangoDatabase, NangoDataTypeMap } from '../models/data.types.js';
import { v4 as uuidv4 } from 'uuid';

class DataService {
    /**
     * Insert objects fetched from external API in  raw format.
     *
     * @remarks
     * Supports two modes: upsert or overwrite.
     */
    async upsertRawFromList(objects: RawObject[], sync: Sync): Promise<{ addedIds: number[]; deletedIds: number[]; updatedIds: number[]; objIds: number[] }> {
        var addedIds: number[] = [];
        var deletedIds: number[] = [];
        var updatedIds: number[] = [];
        var objIds: number[];
        let deleteDate = new Date();

        if (sync.unique_key != null) {
            let addedKeys = await this.computeAddedKeys(sync, objects);
            deletedIds = await this.computeDeletedIds(sync, objects);
            updatedIds = await this.computeUpdatedIds(sync, objects);

            // 'unique_key' provided: upsert mode.
            await this.deleteRaw(sync, deletedIds, deleteDate, true);
            let results = await db
                .knex<RawObject>(`_nango_raw`)
                .withSchema(db.schema())
                .insert(objects, ['id', 'unique_key'])
                .onConflict(['sync_id', 'unique_key'])
                .merge();

            addedIds = results.filter((tuple) => addedKeys.has(tuple.unique_key)).map((tuple) => tuple.id) as number[];
            objIds = results.map((tuple) => tuple.id) as number[];
        } else {
            deletedIds = await this.fetchPastIds(sync); // In overwrite mode, all past records are deleted, all fetched records are added, no record updated.

            // No 'unique_key' provided: overwrite mode (delete all old + insert all new).
            await this.deleteRaw(sync, [], deleteDate, false);
            objIds = (await db.knex<RawObject>(`_nango_raw`).withSchema(db.schema()).insert(objects, ['id'])).map((o) => o.id) as number[];
        }

        if (objects.length != objIds.length) {
            throw Error('Inconstent number of raw object IDs returned from the insertion query.');
        }

        return { addedIds: addedIds, deletedIds: deletedIds, updatedIds: updatedIds, objIds: objIds };
    }

    /**
     * Insert objects fetched from external API in transformed/flattened format (using auto-mapping).
     *
     * @remarks
     * Supports two modes: upsert or overwrite.
     */
    async upsertFlatFromList(
        objects: object[],
        objIds: number[],
        metadata: Record<string, string | number | boolean> | undefined,
        sync: Sync,
        deletedIds: number[]
    ): Promise<void | number[]> {
        let deleteDate = new Date();

        for (let i = 0; i < objects.length; i++) {
            let object = objects[i]!;
            object['_nango_id'] = objIds[i];
            object['_nango_sync_id'] = sync.id!;
            object['_nango_emitted_at'] = new Date();
            object['_nango_unique_key'] = sync.unique_key != null ? _.get(object, sync.unique_key, this.defaultUniqueKey()) : this.defaultUniqueKey();
            object['_nango_deleted_at'] = null;

            Object.assign(object, metadata || {}); // Add the metadata to each row.
        }

        if (sync.unique_key != null) {
            // 'unique_key' provided: upsert.
            await this.deleteFlat(sync, deletedIds, deleteDate, true);
            await db.knex(this.tableNameForSync(sync)).insert(objects).onConflict(['_nango_sync_id', '_nango_unique_key']).merge();
        } else {
            // No 'unique_key' provided: overwrite mode  (delete all old + insert all new).
            await this.deleteFlat(sync, [], deleteDate, false);
            await db.knex<RawObject>(this.tableNameForSync(sync)).insert(objects);
        }
    }

    /**
     * Fetch the keys of objects fetched for the 1st time from the external API (only in upsert mode).
     *
     * @remarks
     * We would ideally want to fetch Ids, but they do not exist yet because objects have not been writtent to the DB.
     */
    private async computeAddedKeys(sync: Sync, objects: RawObject[]): Promise<Set<string>> {
        let pastKeysArr = await db.knex<RawObject>(`_nango_raw`).withSchema(db.schema()).select('unique_key').where('sync_id', sync.id).whereNull('deleted_at');
        let pastKeysSet = new Set(pastKeysArr.map((o) => o.unique_key));

        return new Set(
            objects
                .filter(function (o) {
                    return !pastKeysSet.has(o.unique_key);
                })
                .map((o) => o.unique_key)
        );
    }

    /**
     * Fetch the IDs of all the existing objects prior to the Sync job (only in Overwrite mode).
     *
     */
    private async fetchPastIds(sync: Sync): Promise<number[]> {
        return (await db.knex<RawObject>(`_nango_raw`).withSchema(db.schema()).select('id').where('sync_id', sync.id).whereNull('deleted_at'))
            .map((o) => o.id || 0)
            .filter((o) => o !== 0);
    }

    /**
     * Fetch the IDs of all objects previously fetched but that are no longer in the external API response (only for Upsert mode).
     */
    private async computeDeletedIds(sync: Sync, objects: RawObject[]): Promise<number[]> {
        return (
            await db
                .knex<RawObject>(`_nango_raw`)
                .withSchema(db.schema())
                .select('id')
                .where('sync_id', sync.id)
                .whereNull('deleted_at')
                .whereNotIn(
                    'unique_key',
                    objects.map((o) => o.unique_key)
                )
        )
            .map((o) => o.id || 0)
            .filter((o) => o !== 0);
    }

    /**
     * Fetch the IDs of all objects that existed, are in the external API response with different content.
     */
    private async computeUpdatedIds(sync: Sync, objects: RawObject[]): Promise<number[]> {
        return (
            await db
                .knex<RawObject>(`_nango_raw`)
                .withSchema(db.schema())
                .select('id')
                .where('sync_id', sync.id)
                .whereNull('deleted_at')
                .whereIn(
                    'unique_key',
                    objects.map((o) => o.unique_key)
                )
                .whereNotIn(
                    ['unique_key', 'data_hash'],
                    objects.map((o) => [o.unique_key, o.data_hash])
                )
        )
            .map((o) => o.id || 0)
            .filter((o) => o !== 0);
    }

    /**
     * Handle raw records to delete.
     *
     * @remarks
     * Two sync modes: Upsert (delete specific rows) and Overwrite (delete all previous rows).
     * Two delete modes: Hard (delete records from db) or Soft ('deleted_at' column with date)
     */
    private async deleteRaw(sync: Sync, deletedIds: number[], deleteDate: Date, upsertMode: boolean) {
        let q = db.knex<RawObject>(`_nango_raw`).withSchema(db.schema()).where('sync_id', sync.id);
        if (sync.soft_delete) {
            if (upsertMode) {
                await q.whereIn('id', deletedIds).update('deleted_at', deleteDate);
            } else {
                await q.update('deleted_at', deleteDate);
            }
        } else {
            if (upsertMode) {
                await q.whereIn('id', deletedIds).del();
            } else {
                await q.del();
            }
        }
    }

    /**
     * Handle flat records to delete.
     *
     * @param deletedIds: only used if in Upsert mode, because Overwrite mode deletes all previous records.
     *
     * @remarks
     * Two sync modes: Upsert (delete specific rows) and Overwrite (delete all previous rows).
     * Two delete modes: Hard (delete records from db) or Soft ('deleted_at' column with date)
     */
    private async deleteFlat(sync: Sync, deletedIds: number[], deleteDate: Date, upsertMode: boolean) {
        let q = db.knex(this.tableNameForSync(sync)).where('_nango_sync_id', sync.id);
        if (sync.soft_delete) {
            if (upsertMode) {
                await q.whereIn('_nango_id', deletedIds).update('_nango_deleted_at', deleteDate);
            } else {
                await q.update('_nango_deleted_at', deleteDate);
            }
        } else {
            if (upsertMode) {
                await q.whereIn('_nango_id', deletedIds).del();
            } else {
                await q.del();
            }
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
                t.integer('_nango_id').primary();
                t.integer('_nango_sync_id').references('id').inTable(`${db.schema()}._nango_syncs`);
                t.dateTime('_nango_emitted_at').notNullable();
                t.string('_nango_unique_key');
                t.dateTime('_nango_deleted_at');

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
