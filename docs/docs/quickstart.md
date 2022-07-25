---
sidebar_label: Quickstart 🚀
sidebar_position: 2
---

# Quickstart

Let's test Nango and send a message to Slack in 30 seconds.

## Start the clock & let's go!
Clone the Nango repo & move into the example dir:
```bash
git clone https://github.com/nangohq/nango.git
cd nango/examples/quickstart
```

Copy/paste the Slack access token provided [here](https://nangohq.notion.site/Quickstart-Slack-access-token-f41c7cc291c74fbd9b1110af6d631d01).

Open the `run-quickstart.js` file and fill in your name and token on the following lines:
```javascript
...
const slackMessage = `Hello <your-name-goes-here>, welcome to Nango! :wave:`; // TODO: fill in your name.
await nango.registerConnection('slack', 1, '<token-goes-here>').catch((e) => {console.log(e)}); // TODO: fill in token.
...
```

Start the Nango server docker container (if you haven't already, [install Docker](https://www.docker.com/products/docker-desktop/) first):
```bash
cd nango-integrations
docker compose up # or docker-compose up
```

Open a new terminal, `cd` back to the example folder and run `run-quickstart.js`:
```bash
node run-quickstart.js
```

Finally, go check that your greeting message was sent to the **#welcome** channel of our [community Slack](https://nango.dev/slack) 🎉

:::tip
Not working as expected? Just ask in the [community Slack](https://nango.dev/slack), we are very active there and will be glad to assist you!
:::

## Where to go from here

Curious to understand what happens under the hood? Unwrap this Quickstart with the step-by-step [Tutorial](build-integrations/README.md). 