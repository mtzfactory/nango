---
sidebar_label: 'Quickstart: Node'
sidebar_position: 1
---

# Quickstart: Node

### Intro

With this tutorial you will build a Slack Integration from scratch in **10 minutes**. Ready? Let's go!

### Prerequisites

- A recent version of `npm` (>= 7.20.0) and `NodeJS` (>= 16.7.0) ([instructions](https://www.notion.so/nangohq/Prerequisites-398e9314196b44cb8950132df15c8752) to check and install prerequisites)
- Docker (installation instructions [here](https://www.docker.com/products/docker-desktop/))

### Start a new project

Fetch this [empty Node app](https://github.com/NangoHQ/node-sample) (or use your own):
```bash
git clone https://github.com/NangoHQ/node-sample.git
```
```bash
cd node-sample
```

### Initialize Nango

Initialize the Nango Folder that will host your integration-specific code, later deployed to the Nango server (cf. [Architecture](architecture.md)):
```bash
npx nango init
```

Navigate into the Nango Folder you just set up:
```bash
cd nango-integrations
```

### Run the Nango Server

Start the Nango Server with Docker:
```bash
docker compose up # or 'docker-compose up' for older versions
```

Give it a few seconds and then you should see `✅ Nango Server is ready!` printed on your terminal.

The Nango Server is where your Integrations will run. It is a self-contained micro-service that handles retries, queuing, logging, etc. When we write our Slack Integration later on, it will execute on this server.

:::tip
In local development, the Nango Server automatically monitors your Nango Folder for changes to let you run Integrations as you code (cf. [Local Development](local-development.md)).
:::

### Set up npm and Typescript

In a new terminal, navigate to the Nango Folder again:
```bash
cd [...]/node-sample/nango-integrations
```

The Nango Folder is configured as an [npm](https://docs.npmjs.com/packages-and-modules) package, let's install its dependencies by running:
```bash
npm install
```

Nango leverages the [typescript](https://www.typescriptlang.org/) programming language to write Integrations. To be able to run our code, enable continuous compilation of Typescript: 
```bash
node_modules/typescript/bin/tsc -w --project tsconfig.json
```

:::tip
You will see an error in the terminal at first because there is no Typescript file to compile just yet. This will be resolved with the next steps.
:::

Compilation happens on every file save and compilation errors will show up in the terminal window where you just ran the previous command.

### Create an Integration {#create-an-integration}

In a new terminal, navigate to the Nango Folder:
```bash
cd [...]/node-sample/nango-integrations
```

Open the `integrations.yaml` file (cf. [reference](reference/configuration.md#integrationsYaml)) and copy/paste the configuration for our new Slack Integration:
```yaml title="integrations.yaml"
integrations:
    slack:
        base_url: https://slack.com/api/
        call_auth:
            mode: AUTH_HEADER_TOKEN
        log_level: debug
```

Create a directory to host the code for the Slack Integration. In the Nango Folder, run:
```bash
mkdir slack
```
```bash
cd slack
```

### Create an Action

Actions (cf. [Architecture](architecture.md)) contain the business logic that is specific to each integration. They can be customized at will. Here, we want our Action to post a message on Slack. Naturally, Actions may be more complex than this simple example here (cf. [Best Practices](guides/best-practices.md)).

Create a file for our new `notify` Action which will post a message to Slack: 
```bash
touch notify.action.ts
```

Open the `notify.action.ts` file and paste the following scaffold into it:
```typescript title="notify.action.ts"
import { NangoAction } from '@nangohq/action';

class SlackNotifyAction extends NangoAction {

    override async executeAction(input: any) {
        // Add your action code here
    }
}

export { SlackNotifyAction };
```

Note that every Action must follow the following naming patterns to the recognized by the Nango Server:
- `<action-name>.action.ts` for the Action file
- `<IntegrationName><ActionName>Action` for the Action class

The business logic of the Action will be implemented in the `executeAction` method.

From [Slack's API reference](https://api.slack.com/methods/chat.postMessage), the API endpoint for posting a message requires:
- a POST request to https://slack.com/api/chat.postMessage
- a `channel` (string) body parameter, i.e. the destination of the message
- a `text` (string) body parameter, i.e. the content of the message
- a `mrkdown` (bool) body parameter, i.e. the format type of the message

Nango provides us with some helpers that we can (and should) use in our Action:
- For HTTP requests, use the built-in `this.httpRequest` method (cf. [reference](reference/actions.md#httpRequest)), which takes care of auth parameters, retries,  etc.
- For logging, use the built-in logger `this.logger` (cf. [reference](reference/actions.md#logger))

We can now easily write the logic for our Slack Action:
```ts title="notify.action.ts"
// Add this inside of executeAction
const requestBody = {
    channel: input.channelId,
    mrkdwn: input.mrkdwn,
    text: input.msg
};
const response = await this.httpRequest('chat.postMessage', 'POST', undefined, requestBody);

return { status: response.status, statusText: response.statusText };
```

### Trigger your Action

Let's trigger the Action from the main application. First, navigate to the sample project:
```bash
cd [...]/node-sample
```

Install the Nango Node SDK: 
```bash
npm install @nangohq/node-client
```

Create a file that will trigger the Slack Notify Action: 
```bash
touch app.js
```

Open `app.js` and copy/paste: 
```typescript title="app.js"
import Nango from '@nangohq/node-client';

const nango = new Nango();
await nango.connect();

const slackMessage = `<your-name> implemented an integration from scratch 💪`; // TODO: replace name

await nango.registerConnection('slack', 1, '<slack-token-goes-here>').catch((e) => {console.log(e)}); // TODO: replace token

await nango.triggerAction('slack', 'notify', 1, {
        channelId: 'C03QBJWCWJ1',
        mrkdwn: true,
        msg: slackMessage
});

console.log('Message sent, check the #welcome channel in our community Slack -> https://nango.dev/slack');
nango.close();
```

Replace your `<your-name>` with your actual name, and `<slack-token-goes-here>` with [this token](https://nangohq.notion.site/Quickstart-Slack-access-token-f41c7cc291c74fbd9b1110af6d631d01).

If you are curious about the `registerConnection` call, this is how we tell Nango that a user has installed an Integration. You can learn more about it in the [Architecture](architecture.md#nango-integrations--actions) and the [client SDK reference](reference/SDKs/node.md#registerConnection).


### Test your Action

Navigate to the sample project:
```bash
cd [...]/node-sample
```

Run your app: 
```bash
node spp.js
```

You should see a success message in the console!

Go back to the terminal where you ran `docker compose up` to see some detailed logs automatically generated by Nango 😍

Finally, check the [#welcome channel](https://nango-community.slack.com/archives/C03QBJWCWJ1) in our community Slack to make sure your Slack message was properly sent.

🎉🎉🎉 Congrats on your achievement, you just built a Nango Integration from scratch! 🎉🎉🎉

#### How did it go?
We would love hear about your experience! Please don't be shy and give us feedback in the [#general channel](https://nango-community.slack.com/archives/C03QBHSMPUM) or directly to [@robin](https://nango-community.slack.com/archives/D03PZUHHF1V) or [@bastien](https://nango-community.slack.com/archives/D03QEGGULKC) on our community Slack. Thank you so much!