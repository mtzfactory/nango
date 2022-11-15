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

    async listOverdueSyncs(): Promise<Sync[]> {
        // Fetch all the syncs that had a recent job, then fetch all syncs that are NOT these syncs.
        // TODO BB: this is hacky and subperformant, but it will go away once we migrate to Temporal.

        return db.knex
            .withSchema(db.schema())
            .distinct(['_nango_syncs.id'])
            .from<Sync>(`_nango_syncs`)
            .innerJoin(`_nango_jobs`, '_nango_syncs.id', '=', '_nango_jobs.sync_id')
            .whereRaw(`NOW() - _nango_jobs.started_at < interval '60 minutes'`) // Run syncs every hour.
            .then((syncIds: Sync[]) => {
                let ids = syncIds.map((o) => o.id);
                return db.knex.withSchema(db.schema()).select('*').from<Sync>(`_nango_syncs`).whereNotIn('id', ids);
            });
    }
}

export default new SyncsService();
