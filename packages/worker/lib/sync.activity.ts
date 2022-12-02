import externalService from './services/external.service.js';
import dataService from './services/data.service.js';
import { syncsService } from '@nangohq/core';
import schemaManager from './schema.manager.js';

export async function syncActivity(syncId: number): Promise<void> {
    let sync = await syncsService.readById(syncId);

    if (sync == null || sync.id == null) {
        return;
    }

    // Make the request(s) to the external endpoint.
    let rawObjs = await externalService.getRawObjects(sync);

    if (rawObjs.length == 0) {
        return;
    }

    // Insert row results in the DB.
    await dataService.upsertRawFromList(rawObjs, sync);

    // Perform auto JSON-to-SQL schema mapping.
    if (sync.auto_mapping == null || sync.auto_mapping) {
        // Update the schema of the DB for new results.
        let flatObjects = await schemaManager.updateSyncSchemaAndFlattenObjects(
            rawObjs.map((o) => o.data),
            sync.metadata,
            sync.id!
        );

        // Insert flattened results in the DB.
        await dataService.upsertFlatFromList(flatObjects, sync.metadata, sync);
    }
}
