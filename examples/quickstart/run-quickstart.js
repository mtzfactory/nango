/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import Nango from '@nangohq/node-client';

const nango = new Nango();
await nango.connect();

const slackMessage = `Hello <your-name-goes-here>, welcome to Nango! :wave:`; // TODO: fill in your name.
await nango.registerConnection('slack', 1, '<token-goes-here>').catch((e) => {console.log(e)}); // TODO: fill in token.

await nango.triggerAction('slack', 'notify', 1, {
        channelId: 'C03QBJWCWJ1',
        msg: slackMessage
});

console.log('Message sent, check the #welcome channel in our community Slack!');

nango.close();