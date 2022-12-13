# Securing Your Instance

## Protecting developer & user credentials

For endpoints related to configuring providers and fetching user credentials, Pizzly uses [Basic Auth](https://en.wikipedia.org/wiki/Basic_access_authentication).

To activate Basic Auth, generate an API key (e.g. [here](https://codepen.io/corenominal/pen/rxOmMJ)) and add it to the `PIZZLY_SECRET_KEY` environment variable (in the `.env` file at the root of the Pizzly folder).

:::info
This API key should be kept secret at all time and never committed to git. Compromising the API key would compromise your developer and user credentials stored with Pizzly.
:::

Once you redeploy Pizzly, it will expect this secret API key for any sensitive request. 

### CLI requests

Add the `PIZZLY_SECRET_KEY` as an environment variable for your own environmnent, using your `.bashrc` or `.zshrc` file.

### Node SDK

When initializing the `Pizzly` object, pass in the API key in the `secretKey` parameter.

```ts
import { Pizzly } from '@nangohq/pizzly-node'

// Tell Pizzly where to find your Pizzly server + the secret API key.
let pizzly = new Pizzly('http://localhost:3004', apiKey);
```

### REST API

Add an `Authorization` header to your requests with value: `encode_base_64([YOUR-SECRET-API-KEY]:)`

## Publishable key for frontend OAuth flow

Additionally, you can use a publishable key to initiate the OAuth flow from Pizzly's frontend client. This key is not secret as it is embedded in your frontend, it is just a precaution measure.

Generate another API key (e.g. [here](https://codepen.io/corenominal/pen/rxOmMJ)) and add it to the `PIZZLY_PUBLISHABLE_KEY` environment variable (in the `.env` file at the root of the Pizzly folder).

Once you redeploy Pizzly, it will expect this publishable key for initiating OAuth flows from the frontend client. 

In your frontend code, you should now initiate the `Pizzly` object with the publishable key as additional parameter: 

```ts
var pizzly = new Pizzly('http://localhost:3004', publishableKey);
```

