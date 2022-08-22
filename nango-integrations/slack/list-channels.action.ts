/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAction } from '@nangohq/action';

class SlackListChannelsAction extends NangoAction {
    override async executeAction(input: any) {
        // Get a list of all current public &  private channels from Slack (which our app can see). Modify "types" in params to also get DMs and group DMs
        // These are possibly paginated, by default into pages of 100 each.
        // For more details check the Slack API docs: https://api.slack.com/methods/conversations.list
        let channels = [];
        let done = false;
        let params = {
            types: 'public_channel',
            exclude_archived: 'true',
            cursor: ''
        };
        while (!done) {
            var response = await this.httpRequest('conversations.list', 'GET', params);

            if (response.status === 200 && response.json.ok) {
                for (const channel of response.json.channels) {
                    channels.push(channel);
                }

                if (response.json.response_metadata && response.json.response_metadata.next_cursor) {
                    params.cursor = response.json.response_metadata.next_cursor; // Fetch next page
                } else {
                    done = true;
                }
            } else {
                throw new Error(`Encountered a problem whilst fetching channels from Slack: ${response.data}`);
            }
        }

        // Return the retrieved channels
        return channels;
    }
}

export { SlackListChannelsAction };
