---
sidebar_label: 'Intercom'
---

# Blueprint: Intercom

This blueprint of Nango for the Intercom API makes it very easy to work with the Intercom REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Intercom API Docs](https://developers.intercom.com/building-apps/docs)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Intercom blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    intercom:
        extends_blueprint: intercom:v0

        oauth_client_id: <YOUR INTERCOM CLIENT ID>
        oauth_client_secret: ${INTERCOM_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Intercom OAuth 2 and the REST API across all versions.

The base URL for API calls is set to `https://api.intercom.io/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Intercom REST API | ✅ |

## Intercom API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- You set the version of the Intercom API to be used in your Intercom app's settings, which is not how most APIs handle this.
- Signing up for a developer account is easy. But to make your app public, so any Intercom customer can install it, you need to [submit it for review](https://developers.intercom.com/building-apps/docs/review-publish-your-app#section-submit-your-app-for-review). Once submitted you can also apply to have your app listed in the Intercom marketplace. Both are manual review processes so be sure to start them early and plan extra time!

:::info Share your experience
Learned something about working with the Intercom API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-intercom.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::