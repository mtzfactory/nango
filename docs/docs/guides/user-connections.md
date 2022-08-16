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

Before we dive in, this is what a Connection object looks like in Nango:
```ts
{
    uuid: 'unique uuid of the Connection',  // Gets automatically set by Nango when the Connection is first registered
    integration: 'example',                 // The name of the Integration in Nango
    userId: '1',                            // The user's id (from your app)
    dateCreated: '2022-08-10 16:08:23',     // Timestamp when the Connection was created
    lastModified: '2022-08-10 16:08:23',    // Timestamp when the Connection was last modified (by you or Nango)
    credentials: {                          // The current credentials for authorizing requests for this user
        access_token: 'xxxxxxxxx',          // This depends on the auth method of the integration (e.g. here OAuth 2)
        expires_at: '2022-08-10 18:08:23',
        refresh_token: 'yyyyyyyyyyy',
        raw: {                              // For OAuth credentials: The raw server response of the token request
            access_token: 'xxxxxxxxx',
            expires_at: '2022-08-10 18:08:23',
            refresh_token: 'yyyyyyyyyyy',
            server_response: 'I also got returned with the token'
        }
    }       
    additionalConfig: {                     // Additional configuration set by your app for this connection
        sample: 'value'                     // You can store any JSON serializable object here
    }                     
```

## How to register a new Connection
Now that you have built Integrations with Actions you want your users to be able to set them up in your application. There are two ways in which you can do this:

1. You [trigger an OAuth flow in your frontend](guides/auth.md#frontendOauth) when the user wants to setup an Integration which supports OAuth _(recommended for OAuth based integrations)_
2. You register a new Connection from your backend by [calling `registerConnection`](reference/SDKs/node.md#registerConnection) in the client SDK _(necessary for APIs which do not support OAuth)_

Both cases will result in a Connection being registered in the Nango server. Once a Connection has been registered for a user you can start triggering actions for their user id as shown in [Trigger an action](guides/trigger-an-action.md).

Check the links in the list above for examples of how to register a Connection in Nango with either method.

## Storing user specific configuration & accessing it in the Action {#additionalConfig}
For some integrations it makes sense to store additional configuration for every user who has the integration up:
- With a Slack integration you might want to store the channel ID where the user would like to receive notifications.
- For a CRM integration you might want store a user specific mapping between a contact's fields and your internal fields

For this Nango offers you the option to store an object, called `additionalConfig`, along with the Connection. The Connection, and with it the `additionalConfig`, is also available to your [Action code](guides/create-an-action.md). You can think of the `additionalConfig` as a key-value store or document database to store data across different actions for a specific user and integration.

Here is what it could look like in practice for a Slack integration posting notifications to a user-selected channel:
<Tabs groupId="programming-language">
<TabItem value="node" label="Node" default>

```ts title="In your main app code"
// Store the user's preferred channelID in additionalConfig of the Connection
function setSlackNotificationChannel(userId, newChannelId) {
    const newConfig = {
        channelId: newChannelId
    };
    nango.updateConnectionConfig('slack', userId, newConfig);
}
```

And then in your Action's `executeAction`, note how the notification text is an input of the Action (it can change with every Action call) but the channel Id is set based on the configuration stored in the Connection (it stays the same for this user & this Integration):
```ts title="notify.action.ts"
//...
override async executeAction(input: any) {
    
    // Get the user's preferred channelId
    const connection = this.getCurrentConnection();
    const channelId = (connection.additionalConfig.channelId) ? connection.additionalConfig.channelId : 'default value';

    // Send the notification
    const body = {
        channelId: channelId,
        text: input.msg,
        mrkdwn: true
    };

    const response = await this.httpRequest('chat.postMessage', 'POST', undefined, body);
    return response;
}
//...
```

Check the reference for details on the [`getCurrentConnection` method](reference/actions.md#getCurrentConnection).

</TabItem>
<TabItem value="other" label="Other Languages">
    Coming soon!
</TabItem>
</Tabs>

## Getting all Connections for a specific user Id
To get all Integrations which a user has setup you can query for all Connections of a user's id:

<Tabs groupId="programming-language">
<TabItem value="node" label="Node" default>

```ts
const userId = '1';
const userConnections = await nango.getConnectionsForUserId(userId);

console.log(`The user with id "${userId}" has these active connections:`, userConnections);
```

For a detailed documentation of the returned connections object check the [SDK reference for `getConnectionsForUserId`](reference/SDKs/node.md#getConnectionsForUserId).

</TabItem>
<TabItem value="other" label="Other Languages">
    Coming soon!
</TabItem>
</Tabs>

You might want to make Nango's response of this available as an endpoint in your own backend so the frontend can always query which Integrations the currently logged in user has set up.

## Getting all Connections of a specific Integration
To get all the users which have setup a specific Integration you can query for all Connections of an integration:

<Tabs groupId="programming-language">
<TabItem value="node" label="Node" default>

```ts
const integration = 'slack';
const integrationConnections = await nango.getConnectionsForIntegration(integration);

console.log(`The integration "${integration}" has these active connections:`, integrationConnections);
```

For a detailed documentation of the returned connections object check the [SDK reference for `getConnectionsForIntegration`](reference/SDKs/node.md#getConnectionsForIntegration).

</TabItem>
<TabItem value="other" label="Other Languages">
    Coming soon!
</TabItem>
</Tabs>

This method is especially helpful for Admin panels or background tasks, where you are e.g. checking periodically to whom you should send a Slack notification.

## Updating credentials for an existing Connection
Sometimes you need to change the credentials of a Connection which already exists. There are two methods to do this, what is best depends on the Integration's authentication method:

1. You can [re-trigger the OAuth flow in your frontend](guides/auth.md#frontendOauth) if the Integration supports OAuth. The user will have to go through the full OAuth flow again and re-authorize your app. _(recommended for OAuth based integrations)_
2. You update the Connection credentials from your backend by [calling `updateConnectionCredentials`](reference/SDKs/node.md#updateConnectionCredentials) in the client SDK _(necessary for APIs which do not support OAuth)_

Follow the links in the list above for a full code example of each flow.