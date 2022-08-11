---
sidebar_label: 'Zoho CRM'
---

# Blueprint: Zoho CRM

This blueprint of Nango for the Zoho CRM API makes it very easy to work with the Zoho CRM REST APIs and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Zoho CRM API Docs](https://www.zoho.com/crm/developer/docs/api)  |  [API gotchas & learnings](#gotchas)

Last updated: 11.08.2022

## How to use it
To create your own integration based on the Zoho CRM blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    zoho-crm:
        extends_blueprint: zoho-crm:v0

        oauth_client_id: <YOUR ZOHO CLIENT ID>
        oauth_client_secret: ${ZOHO_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Zoho OAuth 2 V2 and all Zoho CRM APIs (e.g. REST api, Bulk API, Query API etc.). Because of this you also need to append the API version you want to use, but it makes the blueprint more flexible.

The base URL for API calls is set to `https://www.zohoapis.com/crm/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅ | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Zoho CRM APIs | ✅ |

## Zoho CRM API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- None yet, add your experience!

:::info Share your experience
Learned something about working with the Zoho CRM API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-zoho-crm.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::