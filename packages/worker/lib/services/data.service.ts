import { knexDatabase as db } from '@nangohq/core';
import type { RawObject } from '../models/raw_object.model.js';
import type { Sync } from '@nangohq/core';

class DataService {
    async upsertFromList(objects: RawObject[], sync: Sync): Promise<void | number[]> {
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
}

export default new DataService();
