---
sidebar_label: 'Trello'
---

# Blueprint: Trello

This blueprint of Nango for the Trello API makes it very easy to work with the Trello REST API and automates common tasks such as OAuth 1.0a authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Trello API Docs](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Trello blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    trello:
        extends_blueprint: trello:v0

        oauth_client_id: <YOUR TRELLO CLIENT ID> # Trello calls this the api key
        oauth_client_secret: ${TRELLO_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth 1.0a feature and the access token refresh.

### Coverage
Blueprint `v0` covers Trello OAuth 1.0a and the REST API V1.

The base URL for API calls is set to `https://api.trello.com/1`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth1 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Trello REST API | ✅ |

## Trello API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Trello's docs only talk about an "API key" but don't mention an oAuth client id. The two are the same thing, set the api key as the `oauth_client_id` and things will work as expected.
- Trello only offers 3 different scopes and they are a bit hidden in the documentation. You can [find them here](https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/#1-authorize--route-options).
- When requesting authorization Trello lets you specify the expiration date of the access token (1h, 1d, 30d or never). Because there is no way to refresh a token (once expired the user must re-authorize the app) the Nango blueprints sets this by default to `never`. You can override this by overwriting the `expiration` parameter in the authorization step:
```yaml title=integrations.yaml
    trello:
        extends_blueprint: trello:v0

        auth:
            authorization_params:
                expiration: '1d' # or any other of the above values
```
- There is no review process to make an app public, once you have an API key anybody can immediately install the application.

:::info Share your experience
Learned something about working with the Trello API that you want to share with other developers? [Add it to this page](https://Trello.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-trello.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::