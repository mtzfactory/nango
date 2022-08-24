---
sidebar_label: 'Xero'
---

# Blueprint: Xero

This blueprint of Nango for the Xero API makes it very easy to work with the Xero REST APIs and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Xero API homepage](https://developer.xero.com/)  |  [Xero API Docs](https://developer.xero.com/documentation/api/accounting/overview)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Xero blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    xero:
        extends_blueprint: xero:v0

        oauth_client_id: <YOUR XERO CLIENT ID>
        oauth_client_secret: ${XERO_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Xero OAuth 2 and all Xero APIs (e.g. accounting API, Assets API, Finance API etc.)

The base URL for API calls is set to `https://api.xero.com/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅ see gotchas below for details | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Xero APIs | ✅ |

## Xero API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Signing up for a developer account is quick & easy. Once you have your OAuth client ID & secret any Xero customer can connect to your application, but there is a limit of 25 Xero accounts that can be connected to your app. To lift this limit you need to [apply to become a Xero App partner](https://developer.xero.com/documentation/xero-app-store/app-partner-guides/app-partner-steps/). This is a manual process and involves a **mandatory revenue share agreement**, so make sure you look at this before starting to build any big integrations.
- By default the access token expires and cannot be refreshed. To get a refresh token, so Nango can automatically refresh your access token, add the [scope `offline_access`](https://developer.xero.com/documentation/guides/oauth2/scopes/#offline-access) to your requested scopes. Nango will then automatically store the refresh token and refresh the access token as needed.
- Refresh tokens also expire after 60 days. In practice this means users will need to re-authorize your app if your app has not made any requests to the Xero api for that user within the last 60 days.
- Apart from the normal access token, which Nango sets automatically for you, Xero also requires you to pass in a `Xero-tenant-id` header with every request you make to the API. You can find more details on how to retrieve the Tenant id [here in the Xero docs](https://developer.xero.com/documentation/guides/oauth2/auth-flow/#5-check-the-tenants-youre-authorized-to-access). We recommend that you store the Tenant ID on the user's Connection object in Nango so you can add the header in your action as needed.

:::info Share your experience
Learned something about working with the Xero API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-xero.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::