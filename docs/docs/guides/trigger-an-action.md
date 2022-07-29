---
sidebar_label: 'Trigger an Action'
sidebar_position: 3
---


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


# Trigger an Action

Let's assume you have a `myintegration` Integration and a `myaction` Action already configured (cf. [Create an Integration](guides/create-an-integration.md) and [Create an Action](guides/create-an-action)).

To trigger an Action from your main application, you need to install the Nango SDK. In your app's directory, run:
<Tabs>
<TabItem value="node" label="Node" default>

```bash
    npm install @nangohq/node-client
```

</TabItem>
<TabItem value="other" label="Other Languages" default>
    Coming soon!
</TabItem>
</Tabs>

In the file where you want to trigger the Action:
<Tabs>
<TabItem value="node" label="Node" default>

```typescript
import Nango from '@nangohq/node-client';

const nango = new Nango();
await nango.connect();

await nango.registerConnection('myintegration', 1, '<oauth-token-goes-here>').catch((e) => {console.log(e)});

await nango.triggerAction('myintegration', 'notify', 1, {param1: value1});

nango.close();
```

</TabItem>
<TabItem value="other" label="Other Languages" default>
    Coming soon!
</TabItem>
</Tabs>
