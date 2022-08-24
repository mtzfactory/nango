---
sidebar_label: 'Discord'
---

# Blueprint: Discord

This blueprint of Nango for the Discord API makes it very easy to work with the Discord REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Discord API Docs](https://discord.com/developers/docs/intro)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Discord blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    discord:
        extends_blueprint: discord:v0

        oauth_client_id: '<YOUR DISCORD CLIENT ID>' # Make sure to quote it so YAML parses it as a string
        oauth_client_secret: ${DISCORD_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Discord OAuth 2 and the REST API across all versions.

The base URL for API calls is set to `https://discord.com/api/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Discord REST API | ✅ |

## Discord API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Our Discord Blueprint assumes you are making requests on a user's behalf, if you are making requests with a bot access token you want to change the Authorize header like this:
```yaml title=integrations.yaml
    discord:
        extends_blueprint: discord:v0

        requests:
            headers:
                Authorize: Bot ${access_token}
```

:::info Share your experience
Learned something about working with the Discord API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-discord.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::