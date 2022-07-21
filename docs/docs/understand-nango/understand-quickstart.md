---
sidebar_label: Understanding the quickstart
sidebar_position: 5
---

# Understanding the quickstart

## Goal

Let's unwrap the quickstart and go through it step by step so you can see how Nango works for this simple example. Within the next **10 minutes** you will build a **Slack integration using Nango from scratch that posts a message** to the #welcome channel of our community Slack ✨

You will learn:

-   How the Nango framework structure works
-   How to run Nango locally for development
-   How to call an Action from Nango
-   See an example of the detailed logging Nango provides you from the start

Ready? Let's go!

## Build a Slack Integration in 10 minutes with Nango

Clone the Nango repo:

```bash
git clone https://github.com/nangohq/nango.git .
```

And move into the folder with our understanding the quickstart example:

```bash
cd nango/examples/understand-quickstart
ls -la
```

We have prepared a small scaffold for you to get started:

-   The `nango-integrations` folder contains our integrations. Here we will add our Slack integration, feel free to explore this directory or [learn more about it here](building-integrations/nango-integrations-folder.md).
-   `run-quickstart.js` is the script that interacts with Nango to register the user connection and trigger the Action. This how you would interact with Nango from your application.
-   `package.json` is a minimal npm package file that just lists the dependency on `@nangohq/client`, which is our node client for Nango. Nango itself is language agnostic and will offer clients for all popular web languages such as PHP, Python, Ruby and Java (and of course you can also contribute one).

To run our `run-quickstart.js` we need to install its dependencies:

```bash
npm install
```

Now open `run-quickstart.js` in your favorite editor and take a look:

```javascript title="run-quickstart.js"
import { Nango } from '@nangohq/client';

// Setup a connection to the Nango server
const nango = new Nango();
nango.connect();

// highlight-start
// TODO: Edit these to your liking
const yourName = 'YourName';
const slackMessage = `Hello ${yourName}, welcome to Nango! :wave:`;
// highlight-end

// Next step: Tell Nango that you, as an end-user, have setup a connection with your Slack integration
// To get the oAuth Access token here go to our Nango community Slack and check the pinned message in #welcome
await nango.registerConnection(
    'slack',               // The name of the integration
    1,                     // The end user's user-id, we just use 1 here
    // highlight-start
    'xoxb-XXXXXXXXXXXXXX'  // A Slack OAuth access token. TODO: Get this from the pinned item in #welcome on our commmunity Slack
    // highlight-end
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
```

All you need to do is edit the parts highlighted here. You can get a Slack access token from our community Slack [[LINK]], please be kind and don't share or abuse it 🙏

Alright, time to compile our Actions: Actions in Nango are written in TypeScript, so we need to compile them to JS before we can run them on the server, but no worries our CLI has you covered:
```bash
cd nango-integrations
npx nango build
```

Last step, let's start the server:
```bash
docker compose up  # or if you are on an older version of docker: docker-compose up
```
Give it a few seconds and then you should see `✅ Nango Server is ready!`

Open a new terminal, cd to the same folder and run our `run-quickstart.js`:
```bash
node run-quickstart.js
```

You should see a success message, check the #welcome channel in our Slack and you should see your personal greeting 🎉

Not working as expected? Just ask in the community Slack, we are very active there and will be glad to assist you!

### By the way...
Did you notice that our "notify" action for Slack is generic? You can use it to post any message to any slack channel on any workspace as long as you know the channel ID (and have a valid access token).

This is an example of what we call Blueprints here at Nango, reusable community contributed integrations. If you use Nango for your integrations you can just copy paste our `notify.action.ts` file and use it in your `nango-integrations` folder. One less integration to write, you're welcome! ;) You can [learn more about Blueprints here](building-integrations/framework-overview.md#blueprints).

## Where to go from here
TODO