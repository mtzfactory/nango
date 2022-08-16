---
sidebar_label: 'SDK: Node'
sidebar_position: 1
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# SDK: Node

This is the reference for the Nango node.js client SDK, which we call node-client and is published on npm as [@nangohq/node-client](https://www.npmjs.com/package/@nangohq/node-client).

Other client SDKs are planned, but currently the node.js client is the only officially supported client of Nango.

It is written in TypeScript and includes types in its npm package for direct use in a TypeScript project. Of course you can also use it in any JavaScript based project that supports ES6. Our node-client supports both ES modules based imports and commonJS type requires.

If you want to go even deeper, the [full source code of node-client](https://github.com/NangoHQ/nango/tree/main/packages/node-client) is available in our GitHub repo (check the `lib` folder for the source files).

## Nango class
You use the node-client by importing the Nango class into your module:

```ts
import Nango from '@nangohq/node-client'
```

When you instantiate Nango you need to pass in the connection details for the rabbitMQ instance that runs with the server. 
```ts
nango = new Nango('localhost', 5672);
```

If you use our default local development setups, you can omit the parameters which will default to `host='localhost'` and `port='5672'`. The previous line can be simplified to:
```ts
let nango = new Nango(); // This works if you use our default local development setup
```

## connect method
Once you have created an instance of the Nango class you should tell it to connect to rabbitMQ.

The `connect` method returns a promise that gets resolved when the connection was successful:
```ts
nango.connect()
.then(() => {
    // Connection was successfull
})
.catch((error) => {
    // There was an error connecting
});

// Or more concise if you expect the connection to succeed
await nango.connect();
```

After connect has succeeded you Nango client is ready to start sending commands to the server. If you send commands before `connect` has succeeded you may get exceptions and messages will be lost.

## registerConnection method {#registerConnection}
Before you can trigger an action for a Connection it must be registered. This can either happen through the user completing a Nango powered OAuth flow or you can manually register it with the `registerConnection` method.The Connection stores information such as the credentials of the user to access the 3rd-party system and any additional configuration which you want to store for thus user-Integration pair.

The registerConnection method takes a number of parameters:
```ts
public async registerConnection(
        integration: string,
        userId: string,
        credentials: NangoAuthCredentials,
        additionalConfig?: Record<string, unknown>
): Promise<NangoMessageHandlerResult<undefined>>
```

Let's briefly look at each one:
- `integration` is the name of the integration for which you are registering the connection. This must match 1:1 with the name of the integration in the `integrations.yaml` file
- `userId` is the id of the user in your application that is setting the connection up. This could be any id, what you use is up to you and your application's use case (e.g. some integrations may be per account, so you could also send an account id instead).
- `credentials` is the credentials object that will be used by Nango to authenticate API calls for this user with this integration (see examples below).
- `additionalConfig` is an optional parameter you can use to store additional information along with this connection. This information will be available to you again in your action code. You can use it to store user-specific configuration of your integration such as e.g. a Slack channel id to post messages to, a mapping of a user's custom fields to your data model or similar configurations. Note that the object you pass in here **must be JSON serializable**.

When called `registerConnection` will return a promise which resolves if the operation succeeded and gets rejected if it did not. Here is how to call it depending on the [auth mode of the Integration](reference/configuration.md#integrationsYaml):
<Tabs>
<TabItem value="oauth2" label="OAuth 2" default>

```ts
let credentials = {
    access_token: 'XXXXXXXXXX',
    // Optional but needed if the access token should be refreshed
    refresh_token: 'RefreshTokenXXXXXXX',
    expires_at: new Date(2022, 09, 01, 23, 59, 59)
};

nango.registerConnection('slack', '1', credentials, { config: 'ZZZZZZZ' })
.then((result) => {
    // register succeeded!
})
.catch((error) => {
    // There was a problem whilst registering the connection
});
```
</TabItem>

<TabItem value="oauth1" label="OAuth 1.0a" default>

```ts
let credentials = {
    oauth_token: 'XXXXXXXXXX',
    oauth_token_secret: 'YYYYYYYYYYYYY'
};

nango.registerConnection('twitter', '1', credentials, { config: 'ZZZZZZZ' })
.then((result) => {
    // register succeeded!
})
.catch((error) => {
    // There was a problem whilst registering the connection
});
```
</TabItem>

<TabItem value="apikey" label="API Key" default>

```ts
let credentials = {
    api_key: 'XXXXXXXXXX'
};

nango.registerConnection('example', '1', credentials, { config: 'ZZZZZZZ' })
.then((result) => {
    // register succeeded!
})
.catch((error) => {
    // There was a problem whilst registering the connection
});
```
</TabItem>

<TabItem value="usernamepw" label="Username & Password" default>

```ts
// Can also be used for api_key & api_secret
let credentials = {
    username: 'XXXXXXXXXX',
    password: 'YYYYYYYY'
};

nango.registerConnection('example', '1', credentials, { config: 'ZZZZZZZ' })
.then((result) => {
    // register succeeded!
})
.catch((error) => {
    // There was a problem whilst registering the connection
});
```
</TabItem>

</Tabs>

The result and error variable in the example above are a [`NangoMessageHandlerResult` object](#nangoMessageHandlerResult).

:::info
Note that connections are unique per user and integration: Attempting to register a connection for the same user id and integration twice will result in an error.
:::

## updateConnectionConfig method {#updateConnectionConfig}
To update the additional config for an already existing Connection you can use the `updateConnectionConfig` method.

If you are not sure what the additional config is and how it can be helpful check the explanation above in the [registerConnection]{#registerConnection} method.

Note the the **new configuration must be JSON serializable** or the call will not succeed and return an error.

```ts
public async updateConnectionConfig(
    integration: string,
    userId: string,
    additionalConfig: Record<string, unknown>
): Promise<NangoMessageHandlerResult<undefined>>
```

An example call looks like this:
```ts
let newConfig = {
    channelId: 'X382949'
};

// Assuming the connection for 'slack' with userId '1' exists
nango.updateConnectionConfig('example', '1', newConfig)
    .catch((error) => {
        console.log(`There was a problem: ${error.errorMsg}`);
    })
    .then(() => {
        console.log('Config updated successfully');
    }) 
```

## updateConnectionCredentials method {#updateConnectionCredentials}
To update the credentials for an already existing Connection you can use the `updateConnectionCredentials` method. Note that the new credentials must conform to the [auth mode of the integration](reference/configuration.md#integrationsYaml) or the call will fail and return an error. You can find examples of valid credentials for each auth mode under [registerConnection](#registerConnection) above.

```ts
public async updateConnectionCredentials(
    integration: string,
    userId: string,
    credentials: NangoAuthCredentials
): Promise<NangoMessageHandlerResult<undefined>>
```

An example call looks like this:
```ts
let credentials = {
    api_key: 'My-new-api-key'
};

// Assuming 'example' is an integration with auth mode API_KEY
// and user with id '1' has an existing Connection:
nango.updateConnectionCredentials('example', '1', credentials)
    .catch((error) => {
        console.log(`There was a problem: ${error.errorMsg}`);
    })
    .then(() => {
        console.log('Credentials updated successfully');
    }) 
```

## getConnectionsForUserId method {#getConnectionsForUserId}
Use this method to retrieve all active Connections for a particular userId. Many applications use this for instance to render their Integrations page where a user can see which Integrations they have already setup or change the configuration of an Integration.

```ts
public async getConnectionsForUserId(userId: string):
    Promise<NangoMessageHandlerResult<NangoConnectionPublic[]>>
```

If a user id does not have any Connections registered in Nango this method will return an empty array.

```ts
nango.getConnectionsForUserId('1')
    .catch((error) => {
        console.log(`There was a problem: ${error.errorMsg}`);
    })
    .then((connections) => {
        console.log('The user with id "1" has the following connections setup:', connections);
    }) 
```

The returned `NangoConnectionPublic` object looks like this:
```js
{
    uuid: 'unique uuid of the Connection object',
    integration: 'example',
    userId: '1',
    dateCreated: '2022-08-10 16:08:23',
    lastModified: '2022-08-10 16:08:23',
    additionalConfig: {} // Or whatever else you stored in additionalConfig
}
```

## getConnectionsForIntegration method {#getConnectionsForIntegration}
This method works the same way as the `getConnectionsForUserId` method above, but instead returns all Connections associated with a particular Integration. This can be helpful for admin backends where you want to show all users who have setup a particular Integration.

```ts
public async getConnectionsForIntegration(integration: string):
    Promise<NangoMessageHandlerResult<NangoConnectionPublic[]>>
```

If a integration does not have any Connections registered in Nango this method will return an empty array.

```ts
nango.getConnectionsForIntegration('example')
    .catch((error) => {
        console.log(`There was a problem: ${error.errorMsg}`);
    })
    .then((connections) => {
        console.log('The integration "example" has the following connections setup:', connections);
    }) 
```

See the `getConnectionsForUserId` method above for the shape or the returned `NangoConnectionPublic` object.

## triggerAction method {#triggerAction}
The `triggerAction` method tells the server to execute an action of an integration in the context of a user's connection.

It's signature looks like this:
```ts
public async triggerAction(
    integration: string,
    triggerAction: string,
    userId: string,
    input: Record<string, unknown>
): Promise<NangoMessageHandlerResult<any>>
```

Let's look at each parameter:
- `integration` is the name of the integration of which you are triggering the action. This must match 1:1 with the name of the integration in the `integrations.yaml` file
- `triggerAction` is the name of the action you want to trigger. This must match 1:1 with the action's name in it's action file, e.g. if the filename is `notify.action.ts` you would put `notify` here
- `userId` is the id of the user for which the action should be called. This must be an id for which a connection was registered for this integration prior to calling `triggerAction`
- `input` is any input that should be passed to the action for its execution. Note that the object you pass in here **must be JSON serializable**.

When the promise resolves it does so with a [`NangoMessageHandlerResult` object](#nangoMessageHandlerResult). In case of success, the `returnValue` of this object will be whatever has been [returned by the `executeAction` method](reference/actions.md#inputReturnValues).

```ts
// Usual shorthand form
let result = await nango.triggerAction('slack', 'notify', 1, { msg: 'Please post this message' });
console.log(`Got this return value from slack.notify: ${result.returnValue}`);

// Or handle the promise manually
nango.triggerAction('slack', 'notify', 1, { msg: 'Please post this message' })
.then((result) => {
    // Success, access the return value at result.returnValue
})
.catch((error) => {
    // Error, learn more by reading error.errorMsg
});
```

## close method
When you are done and want your application to exit you should close your nango connection by calling the `close` method.

Once called you can no longer send messages to the server.

```ts
nango.close()
```

If you do not call `close` nango will keep an open TCP connection which will prevent your node process from exiting automatically.

## NangoMessageHandlerResult object {#nangoMessageHandlerResult}
All messages sent to the Nango server will return a `NangoMessageHandlerResult` object that contains the result of the message's execution.

It's structure looks like this:
```ts
interface NangoMessageHandlerResult<T extends any> {
    success: boolean;
    errorMsg?: string;
    returnValue?: T;
}
```

If the operation succeeded `success` is set to `true` and `returnValue` is set to the result of the operation.

If the operation failed `success` is set to `false` and `errorMsg` contains a detailed error message describing the problem.