import { Nango, NangoHttpMethod } from '@nangohq/node-client';

// Test from the 'nango' folder root with command: npm run example syncHubspotContacts [api-key]
// Endpoint docs: https://developers.hubspot.com/docs/api/crm/contacts
export let syncHubspotContacts = async (api_token: string) => {
    let config = {
        friendly_name: 'Hubspot Contacts',                         // Give this Sync a name for prettier logs.
        mapped_table: 'hubspot_contacts',                          // Name of the destination SQL table
        method: NangoHttpMethod.POST,                              // Required info to query the right endpoint.
        headers: { authorization: `Bearer ${api_token}` },         // For auth.
        body: { limit: 10 },                                       // Specifying each page's size
        paging_cursor_request_path: 'after',                       // For adding pagination data in requests.
        paging_cursor_metadata_response_path: 'paging.next.after', // For finding pagination data in responses.
        response_path: 'results',                                  // For finding records in the API response.
        unique_key: 'id',                                          // Provide response field path for deduping records.
        max_total: 30,                                             // For fetching limited records while testing.
        frequency: '1 minute'                                      // How often sync jobs run in natural language.
    };

    return new Nango().sync('https://api.hubapi.com/crm/v3/objects/contacts/search', config);
};
