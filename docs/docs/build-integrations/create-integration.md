---
sidebar_label: Create an integration
sidebar_position: 3
---

# Creating an integration from scratch

Time for the fun stuff, let's create a Slack integration from scratch!

Our Slack integration will allow us to post any message to any Slack channel of which we know the channel id. In the context of the Nango framework we will create an integration for Slack and then add an action to posting the message to it. If you are curious what exactly an Action is an how the framework works you can [learn more about it here](understand-nango/framework-overview.md).

## Add a new integration

The `nango-integrations` folders contains two configuration files in addition to the `package.json` file:
- `integrations.yaml` which contains the configuration for individual integrations (cf. [`integrations.yaml` reference](reference/config-reference.md#integrationsYaml))
- `nango-config.yaml` which contains Nango-wide variables (cf. [`nango-conifg.yaml` reference](reference/config-reference.md#nangoConfigYaml))

Open the `configurations.yaml` file and copy/paste the configuration for our new Slack integration:
```yaml title="integrations.yaml"
  - slack:
      base_url: https://slack.com/api/
      call_auth:
        mode: AUTH_HEADER_TOKEN
      log_level: debug
```

Now your `integrations.yaml` file should look exactly like this:
```yaml title="integrations.yaml"
integrations:
  - slack:
      base_url: https://slack.com/api/
      call_auth:
        mode: AUTH_HEADER_TOKEN
      log_level: debug
```

Let's briefly unwrap each of these fields (check the [`integrations.yaml` reference](reference/config-reference.md#integrationsYaml) for details): 
- `slack` is the name of your integration in Nango, you will use this string to reference it everywhere
- `base_url` is the 3rd-party API's base URL to be used for http requests
- `call_auth: mode:` setting this to `AUTH_HEADER_TOKEN` tells Nango to add a standard Bearer token to every HTTP header to authorize your requests
- `log_level` indicates how verbose we want Nango's logs for this integration to be. `debug` is best for development to have maximum visibility and will log, amongst other things, every HTTP request we make from the integration.

The last step to configure our Slack integration is to create a directory in `nango-integrations` where we will put all our code related to it. In the `nango-integrations` folder, run:
```bash
mkdir slack
```

## Write an action for your integration

Actions are where the work happens: Nango integrations are composed of actions. 

An action represents any piece of work that involves one or multiple interactions with the 3rd-party API. In our case here, we want our action to post a message on Slack. 

Later, you might want to create more actions for your slack integration, for instance one to read all public channnels or one to react to messages where your bot gets mentioned. You can have as many actions as you want in one integration, in fact our [best-practices](understand-nango/framework-overview.md#actionBestPractices) advise you keep each action small and focused. For more details on how Actions and Integrations work together check out our [Nango Framework Overview](understand-nango/framework-overview.md).

For now, navigate to the Slack integration directory: 
```bash
cd slack
```

And create a file for our new `notify` action which will post a message to a Slack channel: 
```bash
touch notify.action.ts
```

All action files must follow the naming pattern `<action-name>.action.ts` to be recognized by Nango's runtime.

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
Let's unpack what we just pasted in:
- First we import a class called `NangoAction` from a Nango provided npm package
- Next we define a new subclass, `SlackNotifyAction`, which extends the `NangoAction` base class
- We override a method of `NangoAction` called `executeAction` which takes a parameter called `input` that can have any type
- Last but not least we export our newly created class.

This is the basic scaffold for every action in Nango. Note the format of the class name, every action's class in Nango must conform to the naming pattern `<IntegrationName><ActionName>Action`.

When we call our action later on the server will load the appropriate action file and start the execution of our action by calling `executeAction` with the input you specified in your application's trigger code (we will see that in a minute).



### Let's get coding: Adding the logic of our action
The rest of the action will be implemented in the `executeAction` method.

From [Slack's API reference](https://api.slack.com/methods/chat.postMessage), the API endpoint for posting a message requires:
- a POST request to https://slack.com/api/chat.postMessage
- a `channel` (string) body parameter corresponding to a Slack workspace's channel id
- a `text` (string) body parameter containing the message we want to send to Slack
- a `mrkdown` (bool) body parameter that indicates if we want our message to be treated as markdown formatted (yes pleae, we do!)

We will pass these details to our action by using the `input` parameter.

Nango also provides us with some helpers that we can (and should) use in our action:
- To make an HTTP request we can leverage the builtin `this.httpRequest` method, which takes care of auth parameters, retried etc. for us
- To log things we can use `this.logger`, a builtin logger

Using these we can easily write the logic for our Slack application:
```ts title="notify.action.ts"
// Add this inside of executeAction
        const requestBody = {
            channel: input.channelId,
            mrkdwn: true,
            text: input.msg
        };
        const response = await this.httpRequest('chat.postMessage', 'POST', undefined, requestBody);
        
        return { status: response.status, statusText: response.statusText };
```
If you are curioys about `this.httpRequest` you can learn more about it in the [NangoAction reference](reference/nango-action-reference.md#httpRequest)

Et voila, if you put everything together your `notify.action.ts` file should now look like this: 
```ts title="notify.action.ts"
import { NangoAction } from '@nangohq/action';

class SlackNotifyAction extends NangoAction {

    override async executeAction(input: any) {
        const requestBody = {
            channel: input.channelId,
            mrkdwn: true,
            text: input.msg
        };
        const response = await this.httpRequest('chat.postMessage', 'POST', undefined, requestBody);
        
        return { status: response.status, statusText: response.statusText };
    }
}

export { SlackNotifyAction };
```

Because we have started the Nango file watcher in the last step of the tutorial our Typescript file should also already have been picked up by the compiler and gotten compiled. You can check that this succeeded by looking at the `nango-integrations/dist/slack/notify.action.js` file or checking the console output of your `npx nango watch` command (empty means all is well).

## Using Nango in your application to trigger the action 

We are now going to trigger the action from your main application. 

Navigate to your main project's root directory, outside of the `nango-integrations` folder, where your main `package.json` file is located. Run: 
```bash
npm install @nangohq/node-client
```

This will install the Nango SDK in your `node_modules` folder.

Create a file that will trigger the Slack notify action: 
```bash
touch run-slack-notify.js
```

Open `run-slack-notify.js` and import the Nango SDK: 

```typescript title="run-slack-notify.js"
import Nango from '@nangohq/node-client';
```

Instantiate and activate the Nango instance: 
```typescript title="run-slack-notify.js"
const nango = new Nango('localhost');
await nango.connect();
```

Write the message that you want to send to Slack. For example:
```typescript title="run-slack-notify.js"
const slackMessage = `<your-name> implemented an integration from scratch 💪`;
```

If you haven't already, get a Slack access token as detailed in the [Quickstart Guide](quickstart.md). This token is provided by us for the sake of this tutorial, but would otherwise belong toone of your users. With this token, we can tell Nango that a user has initiate a new connection with your Slack integration:
 ```typescript title="run-slack-notify.js"
await nango.registerConnection('slack', 1, '<Slack-token-goes-here>', {});
```

:::info
A Nango connection represents the link between your end-user and Slack. If 10 of your users wanted to benefit from your product's Slack integration, you would have to obtain 10 different access tokens and initiate 10 different Slack connections (for more details on connections check the [Framework Overview](understand-nango/framework-overview.md#overview)).
:::

Shwotime, trigger the notify action of your Slack integration: 
```typescript title="run-slack-notify.js"
await nango.trigger('slack', 'notify', 1, {
        channelId: 'C03QBJWCWJ1',
        mrkdwn: true,
        msg: slackMessage
});
```

The third parameter in the `trigger` method (set to `1` in this example) is the `user_id`. A few lines ago we used `registerConnection` to register a connection for this user, so Nango knows which access token to use for the execution of the action.

The `channelId` parameter is provided by us and corresponds to a Slack channel in our workspace.


Finally, log the completion of the script and terminate the nango instance: 
```typescript {3-4,6} title="run-slack-notify.js"
console.log('Message sent, check the #welcome channel in our community Slack!');
nango.close();
```

At this point, your complete `run-slack-notify.js` file should look like this: 
```typescript title="run-slack-notify.js"
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

Run your script with node: 
```bash
node run-slack-notify.js
```

You should see a success message, check the [#welcome channel](https://nango-community.slack.com/archives/C03QBJWCWJ1) in our community Slack and you should see your personal achievement 🎉

Curious what happened on the Nango server?
Go back to the terminal where you ran `docker compose up` earlier on you can see the beautiful logs automatically generated by Nango 😍

That's it! You just built a full native integration from scratch.

#### How did it go?
We would love hear about your experience: We are very actively working on Nango and your feedback will help us make Nango and this tutorial better. Please don't be shy and write your comments in the [#general channel](https://nango-community.slack.com/archives/C03QBHSMPUM) or directly reach out to [@robin](https://nango-community.slack.com/archives/D03PZUHHF1V) or [@bastien](https://nango-community.slack.com/archives/D03QEGGULKC) on our community Slack. Thank you so much!

### By the way...
Did you notice that our "notify" action for Slack is generic? You can use it to post any message to any slack channel on any workspace as long as you know the channel ID (and have a valid access token).

This is an example of what we call Blueprints here at Nango, reusable community contributed integrations. If you use Nango for your integrations you can just copy paste our `notify.action.ts` file and use it in your `nango-integrations` folder. This means one less integration to write for you. [Learn more about Blueprints here](understand-nango/framework-overview.md#blueprints).