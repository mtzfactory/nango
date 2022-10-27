import externalService from './services/external.service.js';
import type { Sync } from '@nangohq/core';
import _ from 'lodash';
import dataService from './services/data.service.js';
import { syncsQueue, syncsService } from '@nangohq/core';

await syncsQueue.connect();

class SyncExecutor {
    sync: Sync;

    constructor(sync: Sync) {
        this.sync = sync;
    }

    async run() {
        let rawObjs = await externalService.getRawObjects(this.sync);

        if (rawObjs.length > 0) {
            await dataService.upsertFromList(rawObjs);
        } else {
            console.log('No result from external query.');
        }
    }
}

syncsQueue.consume((syncId: number) => {
    syncsService.readById(syncId).then((sync: Sync | null) => {
        if (sync == null) {
            console.log("Unidentified sync ID received from 'syncs' queue.");
            return;
        }

        new SyncExecutor(sync).run();
    });
});
