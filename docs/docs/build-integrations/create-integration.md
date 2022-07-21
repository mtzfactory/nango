---
sidebar_label: Create an integration
sidebar_position: 3
---

# Create an integration

Let's create a Slack integration from scratch! It will post a message in a specific channel in Nango's Slack workspace.

## Configure a new integration

The `nango-integrations` folders contains two configuration files in addition to the `package.json` file:
- `integrations.yaml` which contains the configuration for individual integrations
- `nango-config.yaml` which contains Nango-wide variables (cf. [Configuration Reference](reference/config-reference.md)

Go to the `nango-integrations` directory and create a `integrations.yaml` file: Indeed
```bash
touch integrations.yaml
```

The `integrations.yaml` file will contain the configuration for individual integrations. Open this file and copy/paste the configuration for a new Slack integration:

```yaml
integrations:
  - slack:
      base_url: https://slack.com/api/
      call_auth:
        mode: AUTH_HEADER_TOKEN
      log_level: debug
```

Let's unwrap each of these fields: 
- `slack` is the name of your integration in code
- `base_url` is the 3rd-party API's base URL that will be used for the network Requests
- `call_auth: node:` indicates Nango will use a standard Bearer token in the headers to authenticate HTTP requests
- `log_level` indicates how verbose we want to Nango logs to be. `debug` is best for development to have maximum visibility.

You can find more details about these fields in the [Configuration Reference](reference/config-reference.md).

The last step to configure our Slack integration is to create a directory to locate the code that will power it. In the `nango-integrations` folder, run:
```bash
mkdir slack
```

## Write a new action
Nango integrations are composed of actions. 

An action represents a workflow that involves one or multiple interactions with the 3rd-party API. In our case, the action we want to perform is to post a message on Slack. 

Later, you might want to create more complex actions that involves posting multiple messages to multiple channels, etc. You can have as many actions as you want under one integration (more details in the [Framework Overview](understand-nango/framework-overview.md#overview)).

For now, navigate to the Slack integration directory: 
```bash
cd slack
```

Create a file for a new `notify` action: 
```bash
touch notify.action.ts
```

All action files must contain the suffic `.action.ts` to be recognized by Nango's runtime.

Open the `notify.action.ts` file and import the `NangoAction` class that contains the framework for writing actions:
```typescript {3-4,6} title="notify.action.ts"
import { NangoAction } from '@nangohq/action';
```

Next, set up and export the class for our Slack notify action, extending `NangoAction`: 
```typescript {3-4,6} title="notify.action.ts"
class SlackNotifyAction extends NangoAction {
}
export { SlackNotifyAction }
```

:::info
Notice the standard format of the class name `<IntegrationName><ActionName>Action`.
:::

Inside the `SlackNotifyAction` class, override the `executeAction` method which will be executed by Nango's runtime:
```typescript {3-4,6} title="notify.action.ts"
override async executeAction(input: any) {}
```

The rest of the action will be implemented in the `executeAction` method.

From [Slack's API reference](https://api.slack.com/methods/chat.postMessage), the API endpoint for posting a message requires:
- a POST request to https://slack.com/api/chat.postMessage
- a `channel` (string) body parameter corresponding to a Slack workspace channel
- a `text` (string) body parameter corresponding to the message we want to send to Slack
- a `mrkdown` (bool) body parameter corresponding to the format of the message

The `executeAction` takes in some parameters that your main application will provide via the Nango SDK. We will pass in the 3 body parameters described from your main application in a later section.

Let's create an object for these body parameters:
```typescript {3-4,6} title="notify.action.ts"
const requestBody = {
    channel: input.channelId,
    mrkdwn: input.mrkdwn,
    text: input.msg
};
```

Let's perform the HTTP request to effectively send the Slack message, leveraging the Nango HTTP helper:
```typescript {3-4,6} title="notify.action.ts"
var response = await this.httpRequest('chat.postMessage', 'POST', undefined, requestBody);
```

Here, we do not need to pass in any URL parameters, so the 3rd `httpRequest` method parameter is `undefined`. 

Finally, let's return the result of the HTTP request to the main application to handle the success and error cases: 
```typescript {3-4,6} title="notify.action.ts"
return { status: response.status, statusText: response.statusText };
```

At this point, your `notify.action.ts` file should look like this: 
```typescript {3-4,6} title="notify.action.ts"
import { NangoAction } from '@nangohq/action';

class SlackNotifyAction extends NangoAction {

    override async executeAction(input: any) {
        const requestBody = {
            channel: input.channelId,
            mrkdwn: true,
            text: input.msg
        };
        var response = await this.httpRequest('chat.postMessage', 'POST', undefined, requestBody);
        
        return { status: response.status, statusText: response.statusText };
    }
}

export { SlackNotifyAction };
```

## Trigger the action 

We are now going to trigger the action from your main application. 

Navigate to your main project's root directory, outside of the `nango-integrations` folder, where your main `package.json` file is located. Run: 
```bash
npm install @nangohq/node-client
```

This will install the Nango SDK in your `node_modules` folder.

Create a file that will trigger the Slack Notify action: 
```bash
touch run-slack-notify.js
```

Open `run-slack-notify.js` and import the Nango SDK: 

```typescript {3-4,6} title="run-slack-notify.js"
import Nango from '@nangohq/node-client';
```

Instantiate and activate the Nango instance: 
```typescript {3-4,6} title="run-slack-notify.js"
const nango = new Nango('localhost');
await nango.connect();
```

Write the message that you want to send to Slack. For example:
```typescript {3-4,6} title="run-slack-notify.js"
const slackMessage = `<your-name> implemented an integration from scratch 💪`;
```

If you haven't already, get a Slack access token as detailed in the [Quickstart Guide](quickstart.md). This token is provided by us but would otherwise belong one of your users. With this token, initiate a new connection with Slack: https
 ```typescript {3-4,6} title="run-slack-notify.js"
await nango.registerConnection('slack', 1, '<Slack-token-goes-here>', {});
```

:::info
A Nango connection represents the link between your end-user and Slack. If 10 of your users wanted to benefit from your product's Slack integration, you would have to obtain 10 different access tokens and initiate 10 different Slack connections (more details in the [Framework Overview](understand-nango/framework-overview.md#overview)).
:::

Trigger the Slack Notify action: 
```typescript {3-4,6} title="run-slack-notify.js"
await nango.trigger('slack', 'notify', 1, {
        channelId: 'C03QBJWCWJ1',
        mrkdwn: true,
        msg: slackMessage
});
```

:::info
The third parameter in the `trigger` method (set to `1` in this example) is the `user_id`. It represents the specific user or entity who posesses the access token and for whom you initiated a specific connection.

The `channelId` parameter is provided by us and corresponds to a Slack channel in our workspace.
:::

Finally, log the completion of the script and terminate the nango instance: 
```typescript {3-4,6} title="run-slack-notify.js"
console.log('Message sent, check the #welcome channel in our community Slack!');
nango.close();
```

At this point, your `run-slack-notify.js` file should look like this: 
```typescript {3-4,6} title="run-slack-notify.js"
import Nango from '@nangohq/node-client';

const nango = new Nango('localhost');
await nango.connect();

const slackMessage = `<your-name> implemented an integration from scratch 💪`;

await nango.registerConnection('slack', 1, '<slack-token-goes-here>', {});

await nango.trigger('slack', 'notify', 1, {
        channelId: 'C03QBJWCWJ1',
        mrkdwn: true,
        msg: slackMessage
});

console.log('Message sent, check the #welcome channel in our community Slack!');

nango.close();
```

## Test your action

Execute your script with: 
```bash
node run-slack-notify.js
```

You should see a success message, check the #welcome channel in our Slack and you should see your personal achivement 🎉

Go back to the terminal tab where you ran `docker compose up` to visual the beautiful logs automatically printed by Nango.

### By the way...
Did you notice that our "notify" action for Slack is generic? You can use it to post any message to any slack channel on any workspace as long as you know the channel ID (and have a valid access token).

This is an example of what we call Blueprints here at Nango, reusable community contributed integrations. If you use Nango for your integrations you can just copy paste our `notify.action.ts` file and use it in your `nango-integrations` folder. One less integration to write, you're welcome! ;) You can [learn more about Blueprints here](understand-nango/framework-overview.md#blueprints).