---
sidebar_label: Local Development
sidebar_position: 3
---

# Local Development

## Overview

Nango is purposely built to optimize your local development experience:

![Local development](/img/local-development.png)

- The **Nango Folder** lives in your existing project's repository so you can leverage your usual coding environment.
- The **Nango Server** runs locally with Docker, hot-reloading integrations files from the Nango Folder. This lets you run and test integrations as you code.

Nango also provides a CLI to simplify common workflows such as initializing Nango, adding a new Integration or Action etc. 

Get started with local development with the [Quickstart](quickstart/node.md).

## (OAuth) secrets and local development {#secrets}
Secrets, such as the `oauth_client_secret` should never be committed to your source code repository. Because of this Nango supports [environment variable substitution](reference/configuration.md#integrationsConfig-env_vars) in the `integrations.yaml` file.

In practice this means that any placeholder like `${ENV_VAR}` will be replaced with the value of `ENV_VAR` when the Nango server starts.

To make it easy for you to pass these environment variables to the Nango server our default `docker-compose.yaml` specifies a `.dev-secrets` file from which environment variables will be read when the Nango server docker container starts. It is also added to the `.gitignore` so you don't accidentally commit it.

To use the `.dev-secrets` file navigate to your Nango Folder and create the `.dev-secrets` there. You can then add environment variables to it like this:
```text title="..../nango-integrations/.dev-secrets"
SLACK_CLIENT_SECRET="Your_client_secret"
HUBSPOT_CLIENT_SECRET="Another_secret"
```
Of course you can also use any other method docker compose supports to pass these environment variables to the Nango server on startup. 

## OAuth redirects and local development
Nango's builtin OAuth server also works for local development, it will print the current OAuth callback/redirect URL on startup of the server:

```
info [OAUTH-SERVER] OAuth server started, listening on port 3003. OAuth callback URL: http://localhost:3003/oauth/callback
```

Most OAuth providers force you to register your callback URL(s) with them and luckily many accept `http` for localhost redirects.

However, some insist on a redirect that uses the `https` protocol. Because setting up and self-signing a local SSL certificate for localhost is cumbersome and time consuming we don't recommend this method. Instead we recommend that you use a forwarding service like [ngrok](https://ngrok.com/), which provides you with an `https` callback URL that forwards to your localhost.

If you use the default Nango OAuth server port (3003) this one-liner will do the trick:
```bash
ngrok http 3003
```

Then copy the URL you get under `Forwarding` (it looks something like this: `https://a399-51-839-12-66.eu.ngrok.io`) and add it as the [`oauth_server_root_url`](reference/configuration.md#nangoConfig-oauth_server_root_url) in your nango-config.yaml.