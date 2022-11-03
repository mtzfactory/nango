import { Nango, NangoHttpMethod } from '@nangohq/node-client';

// CLI command: npm start syncHubspotContacts [api-key]
// Endpoint docs: https://developers.hubspot.com/docs/api/crm/contacts
export let syncHubspotContacts = async (api_token) => {
    let config = {
        method: NangoHttpMethod.POST,
        headers: {
            authorization: `Bearer ${api_token}`
        },
        body: {
            limit: 10
        },
        paging_request_path: 'after',
        paging_response_path: 'paging.next.after',
        response_path: 'results',
        max_total: 30
    };

    return Nango.sync('https://api.hubapi.com/crm/v3/objects/contacts/search', config);
};
