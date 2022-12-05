import { Nango, NangoHttpMethod } from '@nangohq/node-client';

// CLI command: npm start syncHubspotContactsWithAuth
// Endpoint docs: https://developers.hubspot.com/docs/api/crm/contacts
export let syncHubspotContactsWithAuth = async () => {
    let config = {
        friendly_name: 'Hubspot Contacts With Auth',               // Give this Sync a name for prettier logs.
        method: NangoHttpMethod.POST,                              // Required info to query the right endpoint.
        headers: { authorization: "Bearer ${pizzlyAccessToken}" }, // For auth, using Pizzly Oauth (cf. github.com/NangoHQ/Pizzly).
        body: { limit: 10 },                                       // Specifying each page's size
        paging_cursor_request_path: 'after',                       // For adding pagination data in requests.
        paging_cursor_metadata_response_path: 'paging.next.after', // For finding pagination data in responses.
        response_path: 'results',                                  // For finding records in the API response.
        unique_key: 'id',                                          // Provide response field path for deduping records.
        max_total: 30,                                             // For fetching limited records while testing.
        pizzly_connection_id: '1',                                 // Pre-configured Pizzly connection ID (cf. github.com/NangoHQ/Pizzly).
        pizzly_provider_config_key: 'hubspot'                      // Pre-configured Pizzly provider configuration (cf. github.com/NangoHQ/Pizzly).
    };

    return new Nango().sync('https://api.hubapi.com/crm/v3/objects/contacts/search', config);
};
