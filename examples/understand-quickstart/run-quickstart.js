import { Nango } from '@nangohq/client';

// Setup a connection to the Nango server
const nango = new Nango();
nango.connect();

// TODO: Edit these to your liking
const yourName = 'YourName';
const slackMessage = `Hello ${yourName}, welcome to Nango! :wave:`;

// Next step: Tell Nango that you, as an end-user, have setup a connection with your Slack integration
// To get the oAuth Access token here go to our Nango community Slack and check the pinned message in #welcome
await nango.registerConnection(
    'slack',               // The name of the integration
    1,                     // The end user's user-id, we just use 1 here
    'xoxb-XXXXXXXXXXXXXX'  // A Slack OAuth access token. TODO: Get this from the pinned item in #welcome on our commmunity Slack
);

// Ready, let's send a message!
await nango.trigger(
    'slack',  // The name of the integration
    'notify', // The name of the Action to trigger
    1,        // The user-id for which to trigger
    {
        // An action specific input, in this case:
        channelId: 'XXXXXXXXX',  // The Slack channel ID where to post the message
        msg: slackMessage        // The message to post to Slack
    }
);

console.log('Message sent, check the #welcome channel in our community Slack!');
