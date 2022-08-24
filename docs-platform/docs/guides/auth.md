---
sidebar_label: 'Auth'
sidebar_position: 5
---

# Auth in Nango Integrations

Nango supports many different kinds of authentication & authorization such as OAuth 2, OAuth 1.0a, api key based authorization and even username & password based models such as Basic Auth.

Thanks to the builtin OAuth server, which supports OAuth 2 as well as OAuth 1.0a, you typically do not need to worry about getting, storing and refreshing authorization credentials from users. Nango handles this automatically for you.

:::tip Using a blueprint?
If your Integration uses one of the many [Blueprints](blueprint-catalog/blueprint-overview.md) provided by Nango you can skip this guide: The Blueprint handles all of this for you.

All you have to do is [trigger the OAuth flow](#frontendOauth) from your frontend. Nango will then automatically store the authorization credentials and refresh them as required.
:::

## Triggering an OAuth flow from your frontend {#frontendOauth}
Nango has a built-in OAuth server which handles OAuth 2.0 and 1.0a for you. In practice this means that out of the box Nango handles authentication and authorization of >90% of external APIs for you.

Nango provides a small frontend library that makes working with OAuth very easy. Just add `@nangohq/frontend` as a dependency to your frontend project and then you can trigger an OAuth flow like this:
```js title="In your frontend code that runs in the browser"
import Nango from '@nangohq/frontend'

// Get a Nango frontend client
// 'http://localhost:3003' should match the setting of oauth_server_root_url in nango-config.yaml
// In production localhost:3003 would be replaced with e.g. 'oauth.myservice.com'
var nango = new Nango('http://localhost:3003');

// Trigger an OAuth flow for 'slack' for the user with user-id 1
nango.connect('slack', '1')
    .then((result) => {
        console.log(`OAuth flow succeeded for integration "${result.integrationName}" and user-id "${result.userId}"!`);
    })
    .catch((error) => {
        console.error(`There was an error in the OAuth flow for integration "${error.integrationName}" and user-id "${error.userId}": ${error.error.type} - ${error.error.message}`);
    });
```

That's it, this is all you need to add to implement a full OAuth flow for any Nango Integration into your frontend.

If you need to query whether a certain user id has already setup a specific integration you can easily do so with our backend client SDK. We thus recommend that your backend tells the frontend about which integrations have been setup for a user.

## Configuring authentication for your Integration

:::info
If you are using one of the many [Blueprints](blueprint-catalog/blueprint-overview.md) provided by Nango you most likely do not need this part. It is already handled for you in the Blueprint.

Just [trigger the OAuth flow](#frontendOauth) from your frontend and Nango handles the rest for you.
:::

Every Integration configuration in Nango has an `auth` section which specifies how authentication works for this Integration. For a full reference of all options please check the [Integrations configuration reference](reference/configuration.md#integrationsYaml), here we will just cover the most common use cases.

The configuration depends on the authentication mode used by the external API, let's go over the most frequent ones:

### OAuth 2.0 Authentication & Authorization
By far the most common protocol today is OAuth 2.0 and Nango provides full support for three grant types (if you are not familiar with these don't worry, the default is "authorization_code" which covers 95% of cases): "authorization_code", "client_credentials" and "refresh_credentials" (used for access token refreshes).

Here is a typical OAuth 2.0 configuration for an "authorization_code" grant type:
```yaml title=integrations.yaml
    my-integration:

        oauth_client_id: XXXXXXXXXX
        oauth_client_secret: ${MY_INTEGRATION_OAUTH_CLIENT_SECRET}
        oauth_scopes:
            - my scopes
            - for this integration

        auth:
            auth_mode: OAUTH2

            authorization_url: https://oauth.externalapi.com/authorize
            token_url: https://oauth.externalapi.com/token

            authorization_params:
                additional_params: which are added to the authorization URL above
                response_type: code
                access_type: offline
                are_popular: here

            scope_separator: ',' # The default separator is ' ' but some APIs require scopes to be comma-separated
```

You can find the authorization_url and token_url in the OAuth documentation of your external API. In most cases you only need to specify these and Nango will automatically add all the necessary parameters that are specified in the OAuth 2.0 specs for the "authorization_code" flow.

`${MY_INTEGRATION_OAUTH_CLIENT_SECRET}` refers to an environment variable that holds the oauth_client_secret so you don't have to commit it. For more details on environment variable handling in Integration configuration please check the [reference](reference/configuration.md#integrationsYaml).

#### Handling access token expiration & token refreshes
Many modern OAuth 2.0 APIs, such as Google, Xero or Intercom automatically expire access tokens after a relatively short period of time (~1h is usual). To keep making API requests for these APIs the access token needs to be exchanged for a new one with a special refresh token.

The good news is that **Nango handles expiring access tokens automatically for you**: When the OAuth flow returns a refresh token and an expiration date for the access token, Nango will automatically and transparently refresh the access token for you as needed. You do not need to do any work on your side for this to happen.

However, some APIs will only provide a refresh token if you specifically request "offline" access in the authorization step. You can see an example of this in the snippet above. All Nango Blueprints already specify offline access where needed, but if you manually configure your OAuth 2.0 auth you may need to add this to get access tokens that can be refreshed.

If you are unsure how to setup the configuration for your OAuth 2.0 api or run into any issues please do not hesitate to reach out in our [Slack community](https://nango.dev/slack). We have worked with dozens of OAuth processes and are happy to help you make yours work as well!

### OAuth 1.0a Authentication & Authorization
Some older APIs, such as Twitter and Trello (both of which have [Blueprints](blueprint-catalog/blueprint-overview.md) available), still use the OAuth 1.0a flow for authorizing users in their API. Nango has full support for OAuth 1.0a, including the complex request signing required to make API calls.

A typical OAuth 1.0a configuration looks like this:
```yaml title=integrations.yaml
    my-integration:

        oauth_client_id: XXXXXXXXXX # Sometimes callled the "oauth_consumer_id" in OAuth 1.0 apis
        oauth_client_secret: ${MY_INTEGRATION_OAUTH_CLIENT_SECRET} # Sometimes callled the "oauth_consumer_secret" in OAuth 1.0 apis
        oauth_scopes:
            - my scopes
            - for this integration

        auth:
            auth_mode: OAUTH1

            request_url: https://oauth.externalapi.com/request
            authorization_url: https://oauth.externalapi.com/authorize
            token_url: https://oauth.externalapi.com/token
            signature_method: 'HMAC-SHA1' # 'RSA-SHA1' and 'PLAINTEXT' are also supported

            authorization_params:
                additional_params: which are added to the authorization URL above
                response_type: code
                access_type: offline
                are_popular: here

            scope_separator: ',' # The default separator is ' ' but some APIs require scopes to be comma-separated
```

`${MY_INTEGRATION_OAUTH_CLIENT_SECRET}` refers to an environment variable that holds the oauth_client_secret so you don't have to commit it. For more details on environment variable handling in Integration configuration please check the [reference](reference/configuration.md#integrationsYaml).

If you are unsure how to setup the configuration for your OAuth 1.0a api or run into any issues please do not hesitate to reach out in our [Slack community](https://nango.dev/slack). We have worked with dozens of OAuth processes and are happy to help you make yours work as well!

### API Key based Authentication & Authorization
Some APIs do not support OAuth and just provide an API key to their user. Nango supports this as well and implementing it is easy:

```yaml title=integrations.yaml
    my-integration:
        auth:
            auth_mode: API_KEY
```

To set the Integration up for a user you need to manually ask them in your frontend for the API key. Once you have it you can use the Nango client SDK to register a new Connection with Nango and pass the API key as credentials for this user. The SDK reference of the [registerConnection method](reference/SDKs/node.md#registerConnection) has good examples of how to do this.

### Username & Password based Authentication & Authorization (Basic auth)
Basic auth is still in use for some APIs, sometimes also in the form of an api key and api secret which are provided for these user. Nango supports Basic Auth as well and implementing it is easy:

```yaml title=integrations.yaml
    my-integration:
        auth:
            auth_mode: USERNAME_PASSWORD
```

To set the Integration up for a user you need to manually ask them in your frontend for the username and password (sometimes also called an api key and api secret). Once you have these you can use the Nango client SDK to register a new Connection with Nango and pass them as credentials for this user. The SDK reference of the [registerConnection method](reference/SDKs/node.md#registerConnection) has good examples of how to do this.


## Authorizing requests {#requestAuth}

:::info
If you are using one of the many [Blueprints](blueprint-catalog/blueprint-overview.md) provided by Nango you most likely do not need this part. It is already handled for you in the Blueprint.

Just [trigger the OAuth flow](#frontendOauth) from your frontend and Nango handles the rest for you.
:::

Now that we have authentication setup for the Integration we need to tell Nango how to Authorize the HTTP requests it sends to the external API. This config also specifies the base URL of the API and looks like this:

```yaml title=integrations.yaml
    my-integration:
        auth:
            #... specified above
        requests:
            base_url: https://api.exeternal.com/v1/
            headers:
                User-Agent: Nango
                These Headers: are added to every HTTP request you make in a Nango Action
            params:
                query_params: can also be added
```

Nango's model for this is very flexible and allows you to specify any header and query parameter which should be sent along with each request. Depending on the `auth_mode` of the Integration you also have access to a number of placeholders which allow you to add authorization credentials in any header or query parameter field.

All placeholders always have the format `${placeholder_variable_name}`.

For all auth modes you have access to the raw response values returned by the server when sending back the access token (or the raw values of the credentials you passed in if you used the registerConnection call on the SDK to add the credentials). These are prefixed with `raw.`. You will rarely need to use these but for some APIs they (unfortunately) come in handy. Here is an example:
```js
// Assume the raw server response of the token endpoint was
{
    access_token: "XXXXXXXXXX",
    username: "@username",
}

// Then you could access "username" in the requests part in this way:
${raw.username}
```

Some APIs require the calling application to identify itself with an API key. You can store this api key on the Integration config with the `app_api_key` parameter and you will have access to it in the `requests` part of the config under the same key. This also works for Blueprints which use the `app_api_key` parameter. A simple example:
```yaml title=integrations.yaml
    my-integration:
        app_api_key: 'XXXXXXXXXXXXXXX'

        requests:
           #...
            params:
                api_key: ${app_api_key}
```

The following sections cover the placeholders available for the different types of `auth_mode` supported by Nango.

### Authorizing requests with OAuth 2.0 credentials
OAuth 2.0 always returns an access token at the end of its process and you have access to the following placeholders in the requests part:

| placeholder name| value |
|----|----|
| access_token | The user's current access_token as returned by the OAuth server (refreshed by Nango automatically as needed) |
| oauth_client_id | The integration's oauth_client_id as set in the integration config |
| oauth_client_secret | The integration's oauth_client_secret as set in the integration config |

For most OAuth 2.0 APIs the requests authorization is done with an `Authorization` header and a Bearer token:
```yaml title=integrations.yaml
    my-integration:
        #...
        requests:
           #...
            headers:
                Authorization: Bearer ${access_token}
```

### Authorizing requests with OAuth 1.0a credentials {#oauth1requests}

#### Standard OAuth 1.0a request signing
The OAuth 1.0a spec requires every API request and its parameters to be signed. Luckily Nango handles this complexity automatically for you and adds the appropriate Authorization header to every request if the `auth_mode` is set to OAuth 1.

To use this you **must not** set an `Authorization` header in the requests part. So for most OAuth 1.0a apps the requests configuration will look like this:
```yaml title=integrations.yaml
    my-integration:
        auth:
            auth_mode: OAUTH1
        #...
        requests:
            base_url: https://api.oauth1server.com/
            headers:
                User-Agent: Nango
                Accepts: application/json
```

#### Custom request authorization with OAuth 1.0a flow
If you want to set a custom Authorization header, which you would only do if the API does not use standard OAuth 1.0a request signing, you can specify it in the headers section. If you set this Nango **will not sign** the request and will not add any additional Authorization parameters to the request.

If you add your own Authorization header you have the following OAuth 1.0a specific placeholders available:

| placeholder name| value |
|----|----|
|oauth_token| The user's oauth_token as returned by the OAuth server |
|oauth_token_secret | The user's oauth_token_secret as returned by the OAuth server |
| oauth_client_id | The integration's oauth_client_id as set in the integration config |
| oauth_client_secret | The integration's oauth_client_secret as set in the integration config |

```yaml title=integrations.yaml
    my-integration:
        auth:
            auth_mode: OAUTH1
        #...
        requests:
           #...
            headers:
                Authorization: 'OAuth oauth_consumer_key="${oauth_client_id}", oauth_token="${oauth_token}"' # As an example
```

### Authorizing requests with api key credentials
If your api uses a user specific api key to authorize requests you can access it with the `api_key` placeholder:

| placeholder name| value |
|----|----|
|api_key| The user's api_key as set in registerConnection |

Note that this is different from the Integration wide `app_api_key` mentioned above. You can use both in parallel.

```yaml title=integrations.yaml
    my-integration:
        #...
        requests:
           #...
            headers:
                X-Api-Key: ${api_key} # As an example
            params:
                api_key: ${app_api_key} # As an example
```

### Authorizing requests with Basic Auth (Username & Password) credentials
If your api uses basic auth to authorize requests you would use the username & password auth mode. This gives you access to the following placeholders:

| placeholder name| value |
|----|----|
| username | The user's username as set in registerConnection |
| password | The user's password as set in registerConnection |
| basic_auth_encoded | A basic auth token which is set to `base64encode(username+':'+password)` |

```yaml title=integrations.yaml
    my-integration:
        #...
        requests:
           #...
            headers:
                Authorization: Basic ${basic_auth_encoded}
```



## Need help or something not working?

:::info Need help with Auth?
If you need any help to get the Auth of your Integration working please do not hesitate to reach out on our [Community Slack](https://nango.dev/slack). We are happy to help you out and are very active there!

You can also check our large and ever-growing list of [Blueprints](blueprint-catalog/blueprint-overview.md) to see if we already have a blueprint for the API you are looking to connect. Our Blueprints all cover the auth part for you so you can focus on writing the business logic of your native integration.
:::