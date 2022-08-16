---
sidebar_label: Actions (NangoAction class)
sidebar_position: 2
---

# Actions & the NangoAction base class

`NangoAction` is the name of the base class of all Actions in your `nango-integrations` folder. This page contains the reference of all attributes and methods offered by NangoAction for your actions.

Need even more details? Nango is open source, so you can inspect the current [NangoAction in our GitHub repo](https://github.com/NangoHQ/nango/blob/main/packages/action/lib/action.ts)

## executeAction input and return values {#inputReturnValues}
The `executeAction` method, which you implement in your NangoAction subclass, receives an input value from the [`triggerAction` call](reference/SDKs/node.md#triggerAction) in the client SDK. This input **must be JSON serializable** otherwise you will encounter a runtime error.

It's return value will also be passed back as the return value of the `triggerAction` call in the client SDK, but this again means that whatever you return from the execution of `executeAction` **must be JSON serializable**. Otherwise you will also encounter a runtime error.

```ts
//... inside a subclass of NangoAction

    override async executeAction(input: any) { // input must be JSON serializable

        // All good, works
        return { iam: "JSON serializable" };
    }
```

## Available properties

### this.logger {#logger}
Signature:
```ts
protected logger: winston.Logger;
```

As the signature reveals, the logger is an instance of the popular logger library [Winston](https://github.com/winstonjs/winston). For a full documentation please check the winston website, although you will typically not need to interact with it apart from logging messages.

Nango supports [several log levels](reference/configuration.md#logLevels) which are all directly accessible on the logger as methods:
```ts
this.logger.error('I am an error message');
this.logger.warn('I am an warning');
this.logger.info('I am an informational message');
this.logger.debug('I am a (detailed) debug message');
```

The logger will automatically prepend detailed information on the action and its execution to every message you log:
```
<timestamp> <log-level> [<integration-name>] [<action-name>] [user-id: <user-id>] [exec ID: #<randomly generated 8-digit alphanumeric id>] <Your log messsage comes here>
```

Which looks like this:
```
2022-07-21T13:04:54.323Z info [slack] [notify] [user-id: 1.0] [exec ID: #5SNQTX78] Hello I am an informational message
```

The exec ID is randomly generated at the start of the action's execution and thus unique to this execution. It comes in handy if you are looking for all log messages that originate from a particular execution of an action.

:::tip
Currently Nango logs all messages to `stdout` as well as a log file called `nango-server.log` in the Docker container. To access the log file run:
```bash
docker exec -it nango-server sh
cd /usr/nango-server
```
:::

## Available methods

### this.httpRequest {#httpRequest}
Signature:
```ts
protected async httpRequest(endpoint: string, method: axios.Method, params?: axios.HttpParams, body?: any, headers?: axios.HttpHeader): Promise<AxiosResponse>
```

You should **always** use this builtin method to make HTTP requests inside of your action. Only HTTP requests initiated through the method are properly tracked, authenticated, logged and retried by Nango.

:::info
Because Nango will possibly queue and retry your HTTP request (e.g. if it detects a rate-limit issue or the access token needs to be refreshed) it may take a long time for your HTTP request to complete. In certain situations Nango may also transparently retry HTTP requests issues through this method and only resolve the promise once the request has succeeded. In this case it will always add appropriate log messages on the `info` log level.
:::

#### Authorization of the API call
When you make an HTTP request through this method Nango will automatically add the necessary authorization to the request. How it does this is dictated by the [`auth_mode` as well as the `requests` settings of the integration](reference/configuration.md#integrationsYaml). In the very rare case that you need to interact with this take a look at [guide on requests authorization](guides/auth.md#requestAuth) but 99% of times it should just work™️.

#### Parameter reference
| Parameter | Example value | Description |
|---|---|---|
| endpoint | 'example/endpoint' | Relative endpoint to call, Nango will automatically prepend the [`base_url`](reference/configuration.md#integrationsYaml) specified in the integration configuration.|
| method | 'POST' | The HTTP Method, Nango supports `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`, and `HEAD` |
| params | `{q: 'searchstring'}` | Query parameters to be appended to the URL in the format `{key: value}`. This parameter is optional. |
| body | `{key: aValue }` or `'{"serialized": "JSON"}'` | The data to be passed into the body of the request. If the type of this parameter is `string` it will be passed as-is to the request body (and no headers are set), if it is of type `object` Nango will attempt to serialize the object to JSON and add a `Content-Type` header with value `application/json`. This parameter is optional. |
| headers | `{headerKey: 'headerValue'}` | Additional headers to be added to the HTTP requests. By default Nango will add an appropriate `Authorization` header if required. This parameter is optional.|

#### Debugging HTTP calls
Nango will automatically log details of every HTTP request sent and responses received if the [`log_level` of the integration](reference/configuration.md#integrationsYaml) is set to `debug` or lower. To track 

#### Timeouts
Nango automatically sets a timeout on every HTTP request based on the timeout configuration you specify. If a request fails due to a timeout it's promise will be rejected. Please check the documentation on [`default_http_request_timeout_seconds` in `nango-config.yaml`](reference/configuration.md#nangoConfigYaml) as well the documentation on [`http_request_timeout_seconds` in the integration config](reference/configuration.md#integrationsYaml) for details on how to set the timeout.

#### Returned promise & response object
Calling `httpRequest` returns a promise that resolves when the HTTP request finishes. Nango will only reject the promise if the HTTP request failed, e.g. due to a network issue. So even a 404 or 500 response will lead to a resolved promise.
Nango returns the full [Axios response object](https://axios-http.com/docs/res_schema) to you when the request finishes, please check the linked documentation for a full reference.


### this.getCurrentConnection {#getCurrentConnection}
Signature:
```
protected getCurrentConnection(): NangoConnection
```

This method returns the Nango Connection object for current execution of the action:
```ts
interface NangoConnection {
    uuid: string;
    integration: string;
    userId: string;
    dateCreated: Date;
    lastModified: Date;
    credentials: NangoAuthCredentials;
    additionalConfig: Record<string, unknown> | undefined;
}
```

The main use case of this method is to access the `additionalConfig` property of the Connection object. In `additionalConfig` you can store configuration that is specific to the user and the integration together.

As an example, if you have a Slack integration that posts notifications to a channel the user may be able to select the channel in your application where the would like to receive notifications. You can then store the channel id in `additionalConfig` and access it in your Nango action with this method.

Please note that `additionalConfig` must be JSON serializable as Nango uses this format for storage and internal transmission.

Another use case is when you need to access data the authorization server has returned along with the access token in the OAuth process: The `credentials` property has a sub-property called `raw` which contains the raw response of the server when it last returned an access token (if the access token has been refreshed `raw` will contain the raw server response of the last token refresh).

In practice you could inspect and look at the data like this:
```ts
const connection = this.getCurrentConnection();

this.logger.debug(`Raw credentials response: ${JSON.stringify(connection.credentials.raw)}`);
```

Note that whilst the data returned in `credentials` depends on the type of authentication which the API uses (e.g. OAuth 2, OAuth 1.0a, api key, basic auth) the property is guaranteed to always have the `raw` sub-property. For detailed specs of the returned credentials object check the [regiserConnection reference](reference/SDKs/node.md#registerConnection).