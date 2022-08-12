---
sidebar_label: 'Lever'
---

# Blueprint: Lever

This blueprint of Nango for the Lever API makes it very easy to work with the Lever REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Lever REST API Docs](https://hire.lever.co/developer/documentation)  |  [API gotchas & learnings](#gotchas)

Last updated: 12.08.2022

## How to use it
To create your own integration based on the Lever blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    lever:
        extends_blueprint: lever:v0

        oauth_client_id: <YOUR LEVER CLIENT ID>
        oauth_client_secret: ${LEVER_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Lever OAuth 2 and the Lever V1 REST API.

The base URL for API calls is set to `https://api.lever.co/v1/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  mandatory for all apps | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Lever REST API | ✅ |

## Lever API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- To register your application for OAuth you need to join their [partner program](https://hire.lever.co/developer/partner). Getting a sandbox test account is quick & easy, but to move it to production you need to submit a good number of materials (to be fair, most of these will be used to promote your integration with Lever, but it does look like a decent amount of work!) and schedule an in-person call with their team. This process probably takes few days or more, make sure you have it on your radar early on.
- This is a list of [all possible scopes](https://hire.lever.co/developer/documentation#scopes) you can request.

:::info Share your experience
Learned something about working with the Lever API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-lever.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::