---
sidebar_label: 'MS Teams'
---

# Blueprint: Microsoft Teams

This blueprint of Nango for the MS Teams API makes it very easy to work with the MS Teams REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[MS Teams API Docs](https://docs.microsoft.com/en-us/graph/teams-concept-overview)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the MS Teams blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    ms-teams:
        extends_blueprint: ms-teams:v0

        oauth_client_id: '<YOUR MS TEAMS CLIENT ID>' # Make sure to quote it so YAML parses it as a string
        oauth_client_secret: ${MS_TEAMS_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers MS Teams OAuth 2 V2 and the V1 REST API.

The base URL for API calls is set to `https://graph.microsoft.com/v1.0/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the MS Teams REST API | ✅ |

## MS Teams API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Nothing noteworthy yet, add your experience!

:::info Share your experience
Learned something about working with the MS Teams API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-microsoft-teams.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::