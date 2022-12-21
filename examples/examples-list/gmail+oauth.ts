import { Nango } from '@nangohq/node-client';

// Test from the 'nango' folder root with command: npm run example syncGmailEmails
// Endpoint docs: https://gmail.googleapis.com/gmail/v1/users/me@email.com/messages
export let syncGmailEmails = async (user: string) => {
    let config = {
        friendly_name: 'Gmail Emails',                             // Give this Sync a name for prettier logs.
        mapped_table: 'gmail_emails',                              // Name of the destination SQL table
        headers: { authorization: "Bearer ${pizzlyAccessToken}" }, // For auth, using Pizzly Oauth (cf. github.com/NangoHQ/Pizzly).
        paging_cursor_request_path: 'pageToken',                   // For adding pagination data in requests.
        paging_cursor_metadata_response_path: 'nextPageToken',     // For finding pagination data in responses.
        response_path: 'messages',                                 // For finding records in the API response.
        max_total: 30,                                             // For fetching limited records while testing.
        frequency: '1 minute',                                     // How often sync jobs run in natural language.
        pizzly_connection_id: '2048',                              // Pre-configured Pizzly connection ID (cf. github.com/NangoHQ/Pizzly). TODO BB: change
        pizzly_provider_config_key: 'gmail2'                       // Pre-configured Pizzly provider configuration (cf. github.com/NangoHQ/Pizzly). TODO BB: change
    };

    return new Nango().sync(`https://gmail.googleapis.com/gmail/v1/users/${user}/messages`, config);
};
