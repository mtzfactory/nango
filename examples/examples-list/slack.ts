import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncSlackMessages [app-token] [channel-id]
// Endpoint docs: https://api.slack.com/methods/conversations.history
export let syncSlackMessages = async (app_token: string, channel_id: string) => {
    let config = {
        friendly_name: 'Slack Messages',                                        // For pretty logs.
        response_path: 'messages',                                              // For finding records in the API response.
        paging_cursor_metadata_response_path: 'response_metadata.next_cursor',  // For finding pagination data in responses.
        paging_cursor_request_path: 'cursor',                                   // For adding pagination data in requests.          
        headers: { authorization: `Bearer ${app_token}` },                      // For auth.
        query_params: { channel: channel_id }                                   // For specifying the Slack channel.
    };

    return new Nango().sync('https://slack.com/api/conversations.history', config);
};
