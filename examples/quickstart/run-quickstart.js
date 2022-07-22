import Nango from '@nangohq/node-client';

const nango = new Nango('localhost');
await nango.connect();

// TODO: Edit these to your liking
const yourName = 'YourName';
const slackMessage = `Hello ${yourName}, welcome to Nango! :wave:`;

await nango.registerConnection('slack', 1, 'xoxb-XXXXXXXXXXXXXX'); // TODO: Get the 'xoxb-' access token from the pinned message in #welcome on our commmunity Slack

await nango.triggerAction('slack', 'notify', 1, {
        channelId: 'C03QBJWCWJ1',
        msg: slackMessage
});

console.log('Message sent, check the #welcome channel in our community Slack!');

nango.close();