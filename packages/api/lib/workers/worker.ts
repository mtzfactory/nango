import externalService from './services/external.service.js';
import type { Sync } from '../shared/models/sync.model.js';
import { HttpRequestType } from '../shared/models/sync.model.js';
import _ from 'lodash';
import databaseHelper from './storage/database.helper.js';

class SyncExecutor {
    sync: Sync;

    constructor(sync: Sync) {
        this.sync = sync;
    }

    async run() {
        let rawObjs = await externalService.getRawObjects(this.sync);
        await databaseHelper.createNewSyncTable(this.sync);
        await databaseHelper.upsertFromList(this.sync, rawObjs);
    }
}

await new SyncExecutor({
    id: _.random(0, 10 ^ 6, false),
    url: 'https://api.hubapi.com/crm/v3/objects/contacts/search',
    request_type: HttpRequestType.Post,
    headers: {
        authorization: `Bearer fake-token`
    },
    body: {
        limit: 1,
        properties: []
    },
    unique_key: 'id',
    paging_request_path: 'after',
    paging_result_path: 'paging.next.after'
}).run();

process.exit(0);
