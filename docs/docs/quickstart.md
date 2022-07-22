---
sidebar_label: Quickstart 🚀
sidebar_position: 2
---

# Quickstart

Let's test Nango and send a message to the #welcome channel on our [community Slack](https://join.slack.com/t/nango-community/shared_invite/zt-1cvpdflmb-TMrjJJ_AZJeMivOgt906HA) in 30 seconds.

## Start the clock & let's go!
Clone the Nango repo & move into the example dir:
```bash
git clone https://github.com/nangohq/nango.git
cd nango/examples/quickstart
```

Open the `run-quickstart.js` file and edit the highlighted lines:
```javascript {3-4,6} title="run-quickstart.js"
...
// TODO: Edit these to your liking
const yourName = 'YourName';
const slackMessage = `Hello ${yourName}, welcome to Nango! :wave:`;

await nango.registerConnection('slack', 1, 'xoxb-XXXXXXXXXXXXXX'); // TODO: Get the 'xoxb-' access token from the pinned message in #welcome on our commmunity Slack
...
```
On our [community Slack](https://join.slack.com/t/nango-community/shared_invite/zt-1cvpdflmb-TMrjJJ_AZJeMivOgt906HA), get the access token from the [pinned message in the #welcome channel](https://nango-community.slack.com/archives/C03QBJWCWJ1/p1658405550216239).

Start the Nango server docker container:
```bash
cd nango-integrations
docker compose up # or docker-compose up
```

Open a new terminal, `cd` back to the example folder and run `run-quickstart.js`:
```bash
node run-quickstart.js
```

You should see a success message, check the [#welcome channel](https://nango-community.slack.com/archives/C03QBJWCWJ1) in our Slack and you should see your personal greeting 🎉

Not working as expected? Just ask in the [community Slack](https://join.slack.com/t/nango-community/shared_invite/zt-1cvpdflmb-TMrjJJ_AZJeMivOgt906HA), we are very active there and will be glad to assist you!

## Where to go from here

Curious to understand what happens under the hood? Unwrap this Quickstart with the step-by-step [Tutorial](build-integrations/README.md). 