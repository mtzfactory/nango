---
sidebar_label: 'Salesloft'
---

# Blueprint: Salesloft

This blueprint of Nango for the Salesloft API makes it very easy to work with the Salesloft API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Salesloft API Docs](https://developers.salesloft.com/api.html)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Salesloft blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    salesloft:
        extends_blueprint: salesloft:v0

        oauth_client_id: <YOUR SALESLOFT CLIENT ID>
        oauth_client_secret: ${SALESLOFT_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Salesloft OAuth 2.0 and the Salesloft REST API V1 & V2.

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  mandatory for all Salesloft apps | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Salesloft REST API | ✅ |

## Salesloft API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Signing up for a dev account and getting OAuth credentials is easy, but to distribute your app (so any Salesloft user can install it) you must go through a review process (they call it "whitelist") and submit an entry for their App directory. Whilst this is a manual step and for sure takes a few days on their end, [the asks listed in the docs](https://developers.salesloft.com/api.html#!/Topic/AppSubmissionChecklist) are mostly about ensuring the integration works.

:::info Share your experience
Learned something about working with the Salesloft API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-salesloft.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::