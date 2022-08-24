---
sidebar_label: 'Outreach'
---

# Blueprint: Outreach

This blueprint of Nango for the Outreach API makes it very easy to work with the Outreach API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Outreach API Docs](https://api.outreach.io/api/v2/docs)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Outreach blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    outreach:
        extends_blueprint: outreach:v0

        oauth_client_id: <YOUR OUTREACH CLIENT ID>
        oauth_client_secret: ${OUTREACH_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Outreach OAuth 2.0 and the Outreach REST API V2.

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  mandatory for all Outreach apps | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Outreach REST API | ✅ |

## Outreach API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Refresh tokens expire after 14 days, this means that if your app does not have any interactions for a user within 14 days the refresh token will expire and the user needs to re-authorize your app.
- To get access to the API you must register as an API partner through [this page](https://www.outreach.io/product/platform/api). This is a manual form, so it might take a few hours to days until you get your OAuth client id & secret. The API docs don't mention any additional review process though to distribute your app afterwards, so hopefully this is all.

:::info Share your experience
Learned something about working with the Outreach API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-outreach.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::