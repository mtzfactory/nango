import { Nango, NangoHttpMethod } from '@nangohq/node-client';

export let syncHubspotContacts = async (api_token: string) => {
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

    Nango.sync('https://api.hubapi.com/crm/v3/objects/contacts/search', config)
        .then((res) => {
            console.log(res.data);
        })
        .catch((error) => {
            console.log(error);
        });
};
