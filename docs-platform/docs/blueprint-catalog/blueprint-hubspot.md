---
sidebar_label: 'Hubspot'
---

# Blueprint: Hubspot

This blueprint of Nango for the Hubspot API makes it very easy to work with the Hubspot API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Hubspot API Docs](https://developers.hubspot.com/docs/api/overview)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Hubspot blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    hubspot:
        extends_blueprint: hubspot:v0

        oauth_client_id: <YOUR HUBSPOT CLIENT ID>
        oauth_client_secret: ${HUBSPOT_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Hubspot OAuth 2 and the REST API.

The base URL for API calls is set to `https://api.hubapi.com/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  mandatory for all hubspot apps | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Hubspot REST API | ✅ |

## Hubspot API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Signing up for a developer account is easy. You can distribute your application immediately, but to get rid of a big red warning that is shown to users on the authorize step you must verify with Hubspot. If you want to [list your app in the marketplace](https://developers.hubspot.com/docs/api/listing-your-app) there is a review process and many requirements on your app, be sure to start this process early!

:::info Share your experience
Learned something about working with the Hubspot API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-hubspot.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::


## Action Blueprints (WIP)

| Action | Status | 
|---|---|
| Fetch contacts | ✅ |