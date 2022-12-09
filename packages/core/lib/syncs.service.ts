import db from './database.js';
import type { Sync } from './sync.model.js';

class SyncsService {
    async readById(syncId: number): Promise<Sync | null> {
        let result = await db.knex.withSchema(db.schema()).select('*').from<Sync>(`_nango_syncs`).where({ id: syncId });

        return result == null || result.length != 1 || result[0] == null ? null : result[0];
    }

    async createSync(sync: Sync): Promise<void | Pick<Sync, 'id'>[]> {
        return db.knex.withSchema(db.schema()).insert(sync, ['id']).into<Sync>(`_nango_syncs`);
    }

    async editSync(sync: Sync, updatedFields: object) {
        return await db.knex.withSchema(db.schema()).from<Sync>(`_nango_syncs`).where({ id: sync.id! }).update(updatedFields);
    }
}

export default new SyncsService();
