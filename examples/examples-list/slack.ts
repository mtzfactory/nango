import { Nango } from '@nangohq/node-client';

// Test from the 'nango' folder root with command: npm run example syncSlackMessages [APP-TOKEN] [CHANNEL-ID]
// Endpoint docs: https://api.slack.com/methods/conversations.history
export let syncSlackMessages = async (appToken: string, channelId: string) => {
    let config = {
        friendly_name: 'Slack Messages', // Give this Sync a name for prettier logs.
        mapped_table: 'slack_messages', // Name of the destination SQL table
        response_path: 'messages', // For finding records in the API response.
        paging_cursor_metadata_response_path: 'response_metadata.next_cursor', // For finding pagination data in responses.
        paging_cursor_request_path: 'cursor', // For adding pagination data in requests.
        headers: { authorization: `Bearer ${appToken}` }, // For auth.
        query_params: { channel: channelId }, // For specifying the Slack channel.
        max_total: 100, // For fetching limited records while testing.
        frequency: '1 minute' // How often sync jobs run in natural language.
    };

    return new Nango().sync('https://slack.com/api/conversations.history', config);
};
