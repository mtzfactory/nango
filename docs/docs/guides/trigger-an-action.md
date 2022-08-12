---
sidebar_label: 'Trigger an Action'
sidebar_position: 3
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Trigger an Action

Let's assume you have a `myintegration` Integration and a `myaction` Action already configured (cf. [Create an Integration](guides/create-an-integration.md) and [Create an Action](guides/create-an-action)).

To trigger an Action from your main application, you need to install the Nango SDK. In your app's directory, run:
<Tabs groupId="programming-language">
<TabItem value="node" label="Node" default>

```bash
    npm install @nangohq/node-client
```

</TabItem>
<TabItem value="other" label="Other Languages">
    Coming soon!
</TabItem>
</Tabs>

Then you can use the Nango client to trigger your action, copy this snippet:
<Tabs groupId="programming-language">
<TabItem value="node" label="Node" default>

```typescript
import Nango from '@nangohq/node-client';

const nango = new Nango();
await nango.connect();

// If your Integration supports OAuth you can skip this step
// and use the builtin OAuth server of Nango to get an access token & store it in Nango
let credentials = { api_key: '<add-users-api-key>' };
await nango.registerConnection('myintegration', '1', credentials).catch((e) => {console.log(e)});

// Prime time: Let's trigger the action 'myaction' for the user with id 1!
await nango.triggerAction('myintegration', 'myaction', '1', {param1: value1});

// If we want to know which integrations the user with id 1 has setup
// we can just ask Nango
let integrations = await nango.getConnectionsForUserId('1');

// Or want to know who has setup 'slack'?
let slackUsers = await nango.getConnectionsForIntegration('slack');

nango.close();
```

</TabItem>
<TabItem value="other" label="Other Languages">
    Coming soon!
</TabItem>
</Tabs>

For this code to work the Nango server needs to run locally. This is super easy with Nango, take a look at [Local Development](local-development.md) for a step-by-step guide to run Nango locally.

If you want to learn more about the Nango SDK check out the [SDK reference](reference/SDKs) for your preferred language.

If you want to try the Nango OAuth server, and your Integration supports OAuth, take a look at [how to trigger the OAuth flow from your frontend](guides/auth.md#frontendOauth). Nango will then automatically store the received credentials and you can skip the `registerConnection` call above.

## Next steps
With these three key steps done (Adding an Integration, adding an Action and triggering your Action) you are ready to use Nango in your application 🚀

The best way to explore the power of Nango is to implement a native Integration with it: We suggest you take one of the Integrations from your backlog and implement it with Nango as a proof of concept. You already know everything you need to know to build very powerful, reliable and scalable Integrations with Nango.

If you want to keep on reading consider these:
- [Learn more about Connections](guides/user-connections.md) in Nango and how to work with them
- Explore our [Blueprints catalog](blueprint-catalog/blueprint-overview.md) to get some inspiration for your next native Integration
- Dive deeper into [Logging in Nango](guides/logging.md)
- Join our [Community Slack](https://nango.dev/slack) to see what others are building with Nango and give us feedback