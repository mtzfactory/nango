import syncsQueue from './syncs.queue.js';
import type { Sync } from '../shared/models/sync.model.js';

await syncsQueue.connect();

// syncsQueue.consume((syncId: number) => {
//     syncService.readById(syncId).then((sync: Sync | null) => {
//         if (sync == null) {
//             console.log("Unidentified syncId received from 'syncs' queue.");
//             return;
//         }

//         // TODO BB: call sync executor
//     });
// });

class SyncExecutor {
    sync: Sync;

    constructor(sync: Sync) {
        this.sync = sync;
    }

    public run() {
        // TODO BB: Fetch from endpoint
        // TODO BB: Update DB schema
        // TODO BB: Upsert in DB
    }
}

new SyncExecutor({
    id: 1,
    url: 'https://api.hubapi.com/crm/v3/objects/contacts/search',
    headers: {
        authorization: `Bearer fake-token`
    },
    body: {
        limit: '100',
        properties: []
    },
    unique_key: 'id'
}).run();
