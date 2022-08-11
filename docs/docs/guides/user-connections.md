---
sidebar_label: 'Working with user Connections'
sidebar_position: 4
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Working with user Connections

Next to Integrations and Actions, (user) Connections are the third major element in the Nango [Architecture](architecture.md).

A Connection in Nango links together two things: An Integration and a user-id. When a user sets an Integration up we call this a Connection in Nango. The Connection stores all the relevant details about this user's specific setup of the Integration and you will interact with this object quite frequently when using Nango.

This guide gives you an overview of the most common patterns when working with Connections and how to implement them in your application.

## How to register a new Connection
Now that you have built Integrations with Actions you want your users to be able to set them up in your application. There are two ways in which you can do this:

1. You [trigger an OAuth flow in your frontend](guides/auth.md#frontendOauth) when the user wants to setup an Integration which supports OAuth _(recommended for OAuth based integrations)_
2. You register a new Connection from your backend by [calling `registerConnection`](reference/SDKs/node.md#registerConnection) in the client SDK _(necessary for APIs which do not support OAuth)_

Both cases will result in a Connection being registered in the Nango server. Once a Connection has been registered for a user you can start triggering actions for their user id as shown in [Trigger an action](guides/trigger-an-action.md).

Because Nango keeps track of all registered Connections for all Integrations and all Users it is also the perfect place to query for the Integrations a user has setup, get all users which have setup a specific Integration and similar queries.

## Getting all Connections for a specific user Id
To get all Integrations which a user has setup you can query for all Connections of a user's id:

<Tabs groupId="programming-language">
<TabItem value="node" label="Node" default>

```ts
const 
```

</TabItem>
<TabItem value="other" label="Other Languages">
    Coming soon!
</TabItem>
</Tabs>
