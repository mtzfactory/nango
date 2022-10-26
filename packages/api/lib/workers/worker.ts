import externalService from './services/external.service.js';
import type { Sync } from '../shared/models/sync.model.js';
import _ from 'lodash';
import dataService from './services/data.service.js';
import syncsQueue from '../shared/queues/syncs.queue.js';
import syncsService from '../shared/services/syncs.service.js';

await syncsQueue.connect();

class SyncExecutor {
    sync: Sync;

    constructor(sync: Sync) {
        this.sync = sync;
    }

    async run() {
        let rawObjs = await externalService.getRawObjects(this.sync);

        if (rawObjs.length > 0) {
            await dataService.createNewSyncTable(this.sync);
            await dataService.upsertFromList(this.sync, rawObjs);
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

// await new SyncExecutor({
//     id: _.random(0, 10 ^ 6, false),
//     url: 'https://api.hubapi.com/crm/v3/objects/contacts/search',
//     method: HttpMethod.Post,
//     headers: {
//         authorization: `Bearer fake-token`
//     },
//     body: {
//         limit: 1,
//         properties: []
//     },
//     unique_key: 'id',
//     paging_request_path: 'after',
//     paging_response_path: 'paging.next.after'
// }).run();
