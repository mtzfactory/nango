import externalService from './services/external.service.js';
import dataService from './services/data.service.js';
import { logger, syncsService } from '@nangohq/core';
import schemaManager from './schema.manager.js';

export async function syncActivity(syncId: number): Promise<void> {
    let sync = await syncsService.readById(syncId);

    if (sync == null || sync.id == null) {
        logger.error(`Could not start job for Sync ${syncId} (Sync not found).`);
        return;
    }

    // Make the request(s) to the external endpoint.
    let rawObjs = await externalService.getRawObjects(sync);

    if (rawObjs.length == 0) {
        logger.info(`No object returned from external API request, no data to map & insert to DB.`);
        return;
    }

    // Insert row results in the DB.
    await dataService.upsertRawFromList(rawObjs, sync);

    // Perform auto JSON-to-SQL schema mapping.
    if (sync.auto_mapping == null || sync.auto_mapping) {
        // Update the schema of the DB for new results.
        let flatObjs = await schemaManager.updateSyncSchemaAndFlattenObjs(
            rawObjs.map((o) => o.data),
            sync.metadata,
            sync
        );

        // Insert flattened results in the DB.
        await dataService.upsertFlatFromList(flatObjs, sync.metadata, sync);
    }

    throw new SyncActivitySuccess(rawObjs.length);
}

class SyncActivitySuccess extends Error {
    updatedRecordCount: number;

    constructor(updatedRecordCount: number) {
        super('Sync activity succeded');
        this.name = 'SyncActivitySuccess';
        this.updatedRecordCount = updatedRecordCount;
    }
}
