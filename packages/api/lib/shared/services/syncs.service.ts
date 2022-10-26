import db from '../database.js';
import type { Sync } from '../models/sync.model.js';

class SyncsService {
    async getLastSync(): Promise<Sync | null> {
        return null;
    }

    async readById(syncId: number): Promise<Sync | null> {
        let result = await db.knex<Sync>('syncs').where({ id: syncId });

        if (result == null || result.length != 1 || result[0] == null) {
            return null;
        } else {
            return result[0];
        }
    }

    async createSync(sync: Sync): Promise<void | Pick<Sync, 'id'>[]> {
        return db
            .knex(`syncs`)
            .insert(sync, ['id'])
            .catch((err) => {
                console.error(`There was an error upserting objects by id:`, err);
            });
    }
}

export default new SyncsService();
