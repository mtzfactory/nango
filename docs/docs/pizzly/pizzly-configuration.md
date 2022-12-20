# Other configuration

### Callback URL

The OAuth callback URL is used by external API to communicate authorization responses to the Pizzly server. 

By default, the callback URL is `$SERVER_HOST:$SERVER_PORT/oauth/callback`. If you are following the [Getting Started](getting-started.md), it is `http://localhost:3003/oauth/callback`. 

You will need to register this callback URL with the external API, in additional to obtaining a developer ID, secret and registering access scopes.

You can customize the callback URL to point to a proxy server by editing the `AUTH_CALLBACK_URL` environment variable in the `.env` file at the root of the Pizzly folder.

### CLI Host & Port

The CLI uses the host/port `http://localhost:3003` by default to call the Pizzly server. You can customize this by setting the environment variable named `PIZZLY_HOSTPORT` in your CLI environment, using a `.bashrc` or `.zshrc` file.