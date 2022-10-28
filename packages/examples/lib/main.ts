import { Nango, NangoSyncConfig, NangoHttpMethod } from '@nangohq/node-client';

let config: NangoSyncConfig = {
    method: NangoHttpMethod.Post,
    headers: {
        authorization: `Bearer fake-token`
    },
    body: {
        limit: 10
    },
    unique_key: 'id',
    paging_request_path: 'after',
    paging_response_path: 'paging.next.after'
};

Nango.sync('https://api.hubapi.com/crm/v3/objects/contacts/search', config);
