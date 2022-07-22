---
sidebar_label: node-client reference
sidebar_position: 3
---

# Nango node.js client reference

This is the reference for the Nango node.js client SDK, which we call node-client and is published on npm as [@nangohq/node-client](https://www.npmjs.com/package/@nangohq/node-client).

Other client SDKs are planned, but currently the node.js client is the only officially supported client of Nango.

It is written in TypeScript and includes types in its npm package for direct use in a TypeScript project. Of course you can also use it in any JavaScript based project that supports ES6. Our node-client supports both ES modules based imports and commonJS type requires.

You can find a full example of using the node-client in our quickstart example here: [`run-quickstart.js` source code](https://github.com/NangoHQ/nango/blob/main/examples/quickstart/run-quickstart.js)

If you want to go even deeper, the [full source code of node-client](https://github.com/NangoHQ/nango/tree/main/packages/node-client) is available in our GitHub repo (check the `lib` folder for the source files).

## Nango class
You use the node-client by importing the Nango class into your module:

```ts
import Nango from '@nangohq/node-client'
```

When you instantiate Nango you need to pass in the connection details for the rabbitMQ instance that runs with the server. If you use our default local development setups you just need to pass in `localhost` as the host:
```ts
let nango = new Nango('localhost'); // This works if you use our default local development setup

nango = new Nango('localhost', 5672); // Optionally you can also pass a port. If omitted it will default to 5672 which is the default listening port for rabbitMQ
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

## registerConnection method
You use the `registerConnection` method to create a new connection object on the server. If you are not familiar with the concept of a connection in Nango please check the [Framework Overview](understand-nango/framework-overview.md).

You must register a connection for the (user id, integration) pair before you can trigger an action for it.

The registerConnection method takes a number of parameters:
```ts
public async registerConnection(
        integration: string,
        userId: string,
        oAuthAccessToken: string,
        additionalConfig: Record<string, unknown>
): Promise<NangoMessageHandlerResult>
```

Let's briefly look at each one:
- `integration` is the name of the integration for which you are registering the connection. This must match 1:1 with the name of the integration in the `integrations.yaml` file
- `userId` is the id of the user in your application that is setting the connection up. This could be any id, what you use is up to you and your application's use case (e.g. some integrations may be per account, so you could also send an account id instead).
- `oAuthAccessToken` is the access token associated with this user that will be used by Nango to authenticate API calls
- `additionalConfig` is an optional parameter you can use to store additional information along with this connection. This information will be available to you again in your action code. You can use it to store user-specific configuration of your integration such as e.g. a Slack channel id to post messages to, a mapping of a user's custom fields to your data model or similar configurations. Note that the object you pass in here **must be JSON serializable**.

When called `registerConnection` will return a promise which resolves if the operation succeeded and gets rejected if it did not.
```ts
nango.registerConnection('slack', 1, 'xoxb-XXXXXXXXXXXXXXXX', { channelId: 'XXXXXXX' })
.then((result) => {
    // register succeeded!
})
.catch((error) => {
    // There was a problem whilst registering the connection
});
```

The result and error variable in the example above are a [`NangoMessageHandlerResult` object](#nangoMessageHandlerResult).

:::info
Note that connections are unique per user and integration: Attempting to register a connection for the same user id and integration twice will result in an error.
:::

## triggerAction method {#triggerAction}
The `triggerAction` method tells the server to execute an action of an integration in the context of a user's connection.

It's signature looks like this:
```ts
public async triggerAction(
    integration: string,
    triggerAction: string,
    userId: string,
    input: Record<string, unknown>
): Promise<NangoMessageHandlerResult>
```

Let's look at each parameter:
- `integration` is the name of the integration of which you are triggering the action. This must match 1:1 with the name of the integration in the `integrations.yaml` file
- `triggerAction` is the name of the action you want to trigger. This must match 1:1 with the action's name in it's action file, e.g. if the filename is `notify.action.ts` you would put `notify` here
- `userId` is the id of the user for which the action should be called. This must be an id for which a connection was registered for this integration prior to calling `triggerAction`
- `input` is any input that should be passed to the action for its execution. Note that the object you pass in here **must be JSON serializable**.

When the promise resolves it does so with a [`NangoMessageHandlerResult` object](#nangoMessageHandlerResult). In case of success, the `returnValue` of this object will be whatever has been [returned by the `executeAction` method](nango-action-reference.md#inputReturnValues).

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
interface NangoMessageHandlerResult {
    success: boolean;
    errorMsg?: string;
    returnValue?: any;
}
```

If the operation succeeded `success` is set to `true` and `returnValue` is set to the result of the operation.

If the operation failed `success` is set to `false` and `errorMsg` contains a detailed error message describing the problem.