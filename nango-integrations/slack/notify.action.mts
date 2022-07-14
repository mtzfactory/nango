import {NangoAction} from "../../nango-action.mjs";

class SlackNotifyAction extends NangoAction {

    override async executeAction(input: any) {

        this.logger.info(`SlackNotifyAction has been called with input:\n${JSON.stringify(input)}`);

        // Check that we have a channel id and a message in our input
		if (input.channelId === undefined || input.msg === undefined) {
			throw new Error(`Missing arguments for Slack - notify action, must pass both a channel ID (passed in: ${input.channelId} and a message (passed in: ${input.msg}.`);
		}

		// Execute our Slack API call to post the message
		// using the builtin Nango httpRequest method
		const requestBody = {
			"channel": input.channelId,
			"mrkdwn": true,
			"text": input.msg
		};

		var response = await this.httpRequest('chat.postMessage', 'POST', undefined, requestBody);

		return "all good!";
    }

}

export { SlackNotifyAction };