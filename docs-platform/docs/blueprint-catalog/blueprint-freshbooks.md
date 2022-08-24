---
sidebar_label: 'Freshbooks'
---

# Blueprint: Freshbooks

This blueprint of Nango for the Freshbooks API makes it very easy to work with the Freshbooks REST APIs and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Freshbooks API Docs](https://www.freshbooks.com/api/start)  |  [API gotchas & learnings](#gotchas)

Last updated: 11.08.2022

## How to use it
To create your own integration based on the Freshbooks blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    freshbooks:
        extends_blueprint: freshbooks:v0

        oauth_client_id: <YOUR FRESHBOOKS CLIENT ID>
        oauth_client_secret: ${FRESHBOOKS_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Freshbooks OAuth 2 and all Freshbooks APIs (e.g. Accounting, Invoices etc.)

The base URL for API calls is set to `https://api.freshbooks.com/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Freshbooks APIs | ✅ |

## Freshbooks API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- None yet, add yours!

:::info Share your experience
Learned something about working with the Freshbooks API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-freshbooks.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::