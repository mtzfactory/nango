import type { Sync } from '../../shared/models/sync.model.js';
import db from '../../shared/database.js';
import type { RawObject } from '../models/raw_object.model.js';

class DatabaseHelper {
    async createNewSyncTable(sync: Sync): Promise<void> {
        return db.knex.schema.createTable(`_nango_${sync.id}`, function (table) {
            table.increments('_nango_id').primary();
            table.dateTime('_nango_emitted_at').notNullable();
            table.json('_nango_data').notNullable();
        });
    }

    async upsertFromList(sync: Sync, objects: RawObject[]): Promise<void | number[]> {
        return db
            .knex(`_nango_${sync.id}`)
            .insert(objects.map((o) => ({ _nango_id: o.id, _nango_emitted_at: o.emitted_at, _nango_data: o.data })))
            .onConflict('_nango_id')
            .merge()
            .catch((err) => {
                console.error(`There was an error upserting objects by id:`, err);
            });
    }
}

export default new DatabaseHelper();
