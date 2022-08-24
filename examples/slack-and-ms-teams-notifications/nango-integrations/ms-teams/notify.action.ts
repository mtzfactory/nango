/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAction } from '@nangohq/action';
import { channel } from 'diagnostics_channel';

class MSTeamsNotifyAction extends NangoAction {
    override async executeAction(input: any) {
        // Log that we got called and what the inputs were
        this.logger.info(`MSTeamsNotifyAction has been called with input: ${JSON.stringify(input)}`);

        // Check if we have a preferred teamId and channelId store on the connection
        const connection = this.getCurrentConnection();
        if (connection.additionalConfig && connection.additionalConfig.teamId && connection.additionalConfig.channelId) {
            if (!input.teamId) {
                input.teamId = connection.additionalConfig.teamId;
            }
            if (!input.channelId) {
                input.channelId = connection.additionalConfig.channelId;
            }
        }

        // Check that we have a channel id and a message in our input
        if (!input || !input.teamId || !input.channelId || !input.msg) {
            throw new Error(
                `Missing arguments for MS Teams - notify action, must pass a team ID (passed: ${input.teamId}) a channel ID (passed: ${input.channelId}) and a msg (passed in: ${input.msg}).`
            );
        }

        // Post the message to the channel
        // For details & many more ways of sending things, @mentioning users and channels etc. check the API docs
        // Docs: https://docs.microsoft.com/en-us/graph/api/chatmessage-post?view=graph-rest-1.0&tabs=http
        // chatMessage object reference: https://docs.microsoft.com/en-us/graph/api/resources/chatmessage?view=graph-rest-1.0
        const requestBody = {
            body: {
                contentType: 'text', // Change to HTML if you want to send an HTML formatted message
                content: input.msg
            }
        };
        var response = await this.httpRequest(`/teams/${input.teamId}/channels/${input.channelId}/messages`, 'POST', undefined, requestBody);

        if (response.status === 201) {
            return;
        } else {
            throw new Error(`There was a problem sending the message in channel "${input.channelId}" of team "${input.teamId}": ${response.data}`);
        }
    }
}

export { MSTeamsNotifyAction };
