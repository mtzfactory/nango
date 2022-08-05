/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAction } from '@nangohq/action';

class TwitterTweetAction extends NangoAction {
    override async executeAction(input: any) {
        // Check that we have a message in our input
        if (!input.msg) {
            throw new Error(`Missing arguments for Twitter - tweet action, must pass a message (passed in: ${input.msg}).`);
        }

        // Execute our Slack API call to post the message using the builtin Nango httpRequest method
        const requestBody = {
            text: input.msg
        };
        var response = await this.httpRequest('2/tweets', 'POST', undefined, requestBody);

        // Return the status and statusText of the Slack API request. Could also return any other data here.
        return { status: response.status, statusText: response.statusText };
    }
}

export { TwitterTweetAction };
