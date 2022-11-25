---
sidebar_label: Getting started
---

# Getting started with Pizzly

Setting up Pizzly takes 3 steps:
1. Start the server & enable the providers/APIs you need
2. Add the frontend SDK to trigger new OAuth flows
3. Use the backend SDK or REST API to retrieve fresh access tokens to make API calls

This setup will take about **15-20 minutes**, afterwards you are ready to support OAuth for 50+ APIs!

## Step 1: Start server & enable OAuth providers/APIs
The first step is to start the Pizzly server locally or deploy to a cloud provider.

For this guide we will stick to a local deployment:
```bash
git clone https://github.com/NangoHQ/Pizzly.git
cd Pizzly
docker compose up
```

You should now see a message that the Pizzly server is running.

With the server running you can now use the Pizzly CLI tool to query which OAuth providers are setup:
```bash
npx pizzly config:list
```
If you just installed Pizzly this will print an empty list.

To run OAuth flows from your application you need to setup each provider that you want to use. For this you will need a few things from the OAuth provider/API:
- **Client id** and **client secret**, these identify your application towards the API that offers the OAuth. You need to get these from the API/OAuth provider, usually you will find them in their developer portal.
- The **scopes** you want to request from the user: These will also depend on the API, you can usually find a list of all scopes an API offers in the API documentation.
    - For the commend below your scopes must be comma separated, e.g. `read,write`
- Finally you need to decide on a **config key**. This key will uniquely identify your configuration within Pizzly. If you only have one configuration per API we recommend you use the API's name in all lowercase, e.g. `github` for GitHub, `salesforce` for Salesforce etc.

:::info Callback URL
When setup your application with the OAuth provider they will ask you for a callback URL.

For Pizzly the callback URL is always `[PIZZLY_SERVER_URL]/oauth/callback`, so if Pizzly runs on your local machine the callback URL is `http://localhost:3004/oauth/callback`
:::

With this information you are now ready to configure & enable your first OAuth provider. Here we setup a GitHub config as an example:
```bash
npx pizzly config:create github github <client-id> <client-secret> "<scopes>"
```
If you want to see the help for this command (and all others) run `npx pizzly help` and it will print the help for you.

Now run `npx pizzly config:list` again and you should see your freshly added config 🎉

## Step 2: Trigger the OAuth flow from your frontend
The Pizzly frontend SDK is available at `@nangohq/pizzly-frontend`, install it on your frontend with npm (or your favorite JS package manager):

```bash
npm i -S @nangohq/pizzly-frontend
```

Once you created an instance of Pizzly (which tells the frontend where to find your Pizzly server) triggering a new OAuth flow is easy:
```ts
import Pizzly from '@nangohq/pizzly-frontend'

// Replace 'http://localhost:3004' with the host (and port) where your Pizzly server can be accessed
var pizzly = new Pizzly('http://localhost:3004');

// Trigger an OAuth flow
// The first parameter is the config key you set up in step 1
// The second parameter is the connection id under which this authentication should be stored
pizzly.connect('github', '<connection-id>');
.then((result) => { 
    console.log(`OAuth flow succeeded for provider "${result.integrationKey}" and connection-id "${result.connectionId}"!`);
})
.catch((error) => {
    console.error(`There was an error in the OAuth flow for integration "${error.integrationKey}" and connection-id "${error.connectionId}": ${error.error.type} - ${error.error.message}`);
});
```

This introduces the **connection id**:  
The connection id is the unique identifier for this authentication. You can choose it freely, the only requirements is that the pair of config key + connection id must be unique.

Most of the time it makes sense to use a user id, account id or similar identifier for the connection id (so the authentication is tied to the user, account etc.). But you could choose something different if it is needed for your application.

With the frontend part setup you should now be able to run a full OAuth flow for your configuration and get an access token. Go ahead & try it! 🙌


## Step 3: Accessing fresh access tokens from your backend

The last step is to get a fresh access token in your backend whenever you need to make an authenticated API request for the user.

Why fresh?  
Increasingly OAuth providers are providing access tokens with a limited lifetime of e.g. 30-60 minutes. After this time the token expires and needs to be exchanged for a fresh token. Pizzly handles this exchange transparently for you, but it is important you always request the access token just prior to your API call. Otherwise you may work with a stale token that has been revoked and your API call will fail.

Pizzly offers two ways to get a fresh access token:
- With a **backend SDK**: This is the easiest and preferred way if an SDK is available for your language. You can find examples of all existing SDKs below.
- With a **REST API**: This is the fallback option if no SDK is available for your language.

In both cases you need to tell Pizzly two things to get the access token:
- The **config key**, which identifies the OAuth provider configuration
- The **connection id**, which identifies the specific authentication for which you need the access token

:::caution
It is important that you always get the latest access token from Pizzly just before every API call. Many access tokens expire within a few minutes. Pizzly will refresh them for you but it can only do so if you call it before every API call.

If you cache access tokens in your code you might have API calls fail because the access token has expired.
:::

### Getting an access token - Node SDK
If you are using Node you can use our node SDK which is available at `@nangohq/pizzly-node`.

Install it with
```bash
npm i -S @nangohq/pizzly-node
```

Then in your code, setup a Pizzly instance and get an access token whenever you need one:
```ts
import Pizzly from '@nangohq/pizzly-node'

// Tell Pizzly where to find your Pizzly server
let pizzly = new Pizzly('http://localhost:3004');

let access_token = await pizzly.currentAccessToken('<config-key>', '<connection-id>');

// Sometimes you need access to the raw response from the server that was sent when it sent the access token (because it contains additional metadata you need)
// You can access the latest response with this method
let raw_token_response = await pizzly.rawTokenReponse('<config-key>', '<connection-id>');
```

### Getting an access token - REST API
If you are using a language where Pizzly does not yet have backend SDK you can directly use it's REST API to get an access token.

The api endpoint is located at `[PIZZLY_SERVER_URL]/connection/<connection-id>?integration_key=<integration-key>`.  
Note that you must pass in a `Content-Type: application/json` header along with your request.

Here is an example curl command for Pizzly running on your local machine:
```bash
curl -XGET -H "Content-type: application/json" \
'http://localhost:3004/connection/<connection-id>?integration_key=<integration-key>'
```

This API call will return you a JSON object that contains the refreshed access token as well as additional material (example):
```json
{
  "connection": {
    "id": "<connection-id>",
    "created_at": "2022-11-25T15:55:07.215Z",
    "updated_at": "2022-11-25T15:55:07.215Z",
    "integration_key": "<integration-key>",
    "connection_id": "1",
    "credentials": {
      "type": "OAUTH2",
      "accessToken": "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", // <--- Use this access token for API requests
      "raw": {                                                   // <--- If you need access to the raw token response from the server, use this
        "access_token": "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",
        "token_type": "bearer",
        "scope": "public_repo,user"
      }
    },
    "raw_response": {
      "access_token": "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",
      "token_type": "bearer",
      "scope": "public_repo,user"
    }
  }
}
```

## Need help?

If you run into any trouble whilst setting up Pizzly we are happy to help you.

Please join our [Slack community](https://nango.dev/slack), where we are very active, and we will do our best to help you.

