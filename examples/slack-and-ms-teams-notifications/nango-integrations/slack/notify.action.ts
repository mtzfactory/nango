/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAction } from '@nangohq/action';

class SlackNotifyAction extends NangoAction {
    override async executeAction(input: any) {
        // Log that we got called and what the inputs were
        this.logger.info(`SlackNotifyAction has been called with input: ${JSON.stringify(input)}`);

        // Check if we have a preferred channelId store on the connection
        const connection = this.getCurrentConnection();
        if (connection.additionalConfig && connection.additionalConfig.channelId) {
            if (!input.channelId) {
                input.channelId = connection.additionalConfig.channelId;
            }
        }

        // Check that we have a channel id and a message in our input
        if (input.channelId === undefined || input.msg === undefined) {
            throw new Error(
                `Missing arguments for Slack - notify action, must pass both a channel ID (passed in: ${input.channelId}) and a message (passed in: ${input.msg}).`
            );
        }

        // Execute our Slack API call to post the message using the builtin Nango httpRequest method
        const requestBody = {
            channel: input.channelId,
            mrkdwn: true,
            text: input.msg
        };
        var response = await this.httpRequest('chat.postMessage', 'POST', undefined, requestBody);

        // Return the status and statusText of the Slack API request. Could also return any other data here.
        return { status: response.status, statusText: response.statusText };
    }
}

export { SlackNotifyAction };
