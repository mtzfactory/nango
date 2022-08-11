---
sidebar_label: 'Asana'
---

# Blueprint: Asana

This blueprint of Nango for the Asana API makes it very easy to work with the Asana API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Asana API Docs](https://developers.asana.com/docs)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Asana blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    asana:
        extends_blueprint: asana:v0

        oauth_client_id: '<YOUR ASANA CLIENT ID>' # Make sure to quote it so YAML parses it as a string
        oauth_client_secret: ${ASANA_CLIENT_SECRET}
        oauth_scopes:
            - default
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Asana OAuth 2 and the 1.0 API.

The base URL for API calls is set to `https://app.asana.com/api/1.0`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅ required for all Asana apps | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Asana API | ✅ |

## Asana API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Asana doesn't really use scopes, the `default` scope gives you access to all user data & api endpoints except for the OpenID related ones.
- Registering a new Asana app is fast & easy, no review required. Public distribution (so anybody can install it into their workspace) is also easy. If you want to get listed on the Asana Marketplace there are additional verification steps, which require you to submit test credentials and a screencast amongst others. Plan this well ahead of time!

:::info Share your experience
Learned something about working with the Asana API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-asana.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::


## Action Blueprints (WIP)

| Action | Status | 
|---|---|
| Fetch users | ✅ |