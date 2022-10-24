import syncService from './syncs.service.js';
import type { Sync } from '../shared/models/sync.model.js';
import { HttpRequestType } from '../shared/models/sync.model.js';

class SyncExecutor {
    sync: Sync;

    constructor(sync: Sync) {
        this.sync = sync;
    }

    public run() {
        syncService.getObjects(this.sync);
        // TODO BB: Update DB schema (database schema utils)
        // TODO BB: Upsert in DB (database utils)
    }
}

new SyncExecutor({
    id: 1,
    url: 'https://api.hubapi.com/crm/v3/objects/contacts/search',
    request_type: HttpRequestType.Post,
    headers: {
        authorization: `Bearer fake-token`
    },
    body: {
        limit: '1',
        properties: []
    },
    unique_key: 'id',
    paging_request_path: 'after',
    paging_result_path: 'paging.next.after'
}).run();
