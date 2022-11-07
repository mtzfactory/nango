import db from './database.js';
import type { Sync } from './sync.model.js';

class SyncsService {
    async readById(syncId: number): Promise<Sync | null> {
        let result = await db.knex<Sync>('_nango_syncs').where({ id: syncId });

        return result == null || result.length != 1 || result[0] == null ? null : result[0];
    }

    async createSync(sync: Sync): Promise<void | Pick<Sync, 'id'>[]> {
        return db.knex<Sync>(`_nango_syncs`).insert(sync, ['id']);
    }

    async listOverdueSyncs(): Promise<Sync[]> {
        // Fetch all the syncs that had a recent job, then fetch all syncs that are NOT these syncs.
        // TODO BB: this is hacky and subperformant, but it will go away once we migrate to Temporal.

        return db
            .knex<Sync>(`_nango_syncs`)
            .distinct(['_nango_syncs.id'])
            .innerJoin('_nango_jobs', '_nango_syncs.id', '=', '_nango_jobs.sync_id')
            .whereRaw(`NOW() - _nango_jobs.started_at < interval '2 minutes'`) // Run syncs every hour.
            .then((syncIds: Sync[]) => {
                let ids = syncIds.map((o) => o.id);
                return db.knex<Sync>(`_nango_syncs`).whereNotIn('id', ids);
            });
    }
}

export default new SyncsService();
