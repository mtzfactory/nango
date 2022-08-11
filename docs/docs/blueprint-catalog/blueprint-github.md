---
sidebar_label: 'Github'
---

# Blueprint: Github

This blueprint of Nango for the Github API makes it very easy to work with the Github REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Github REST API Docs](https://docs.github.com/en/rest)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Github blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    github:
        extends_blueprint: github:v0

        oauth_client_id: <YOUR GITHUB CLIENT ID>
        oauth_client_secret: ${GITHUB_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers GitHub OAuth 2 and the REST API.

The base URL for API calls is set to `https://api.github.com/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Github REST API | ✅ |

## Github API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- No bad surprises so far! Feel free to contribute your own learnings

:::info Share your experience
Learned something about working with the Github API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-github.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::


## Action Blueprints (WIP)

| Action | Status | 
|---|---|
| Add star | ✅ |