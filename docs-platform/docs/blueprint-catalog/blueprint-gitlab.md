---
sidebar_label: 'Gitlab'
---

# Blueprint: Gitlab

This blueprint of Nango for the Gitlab API makes it very easy to work with the Gitlab REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Gitlab REST API Docs](https://docs.gitlab.com/ee/api/)  |  [API gotchas & learnings](#gotchas)

Last updated: 12.08.2022

## How to use it
To create your own integration based on the Gitlab blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    gitlab:
        extends_blueprint: gitlab:v0

        oauth_client_id: <YOUR GITLAB CLIENT ID>
        oauth_client_secret: ${GITLAB_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Gitlab OAuth 2 and the REST API.

The URLs used by this Blueprint are for the Gitlab SaaS hosted version, to use it for a self-hosted instance just change the OAuth URLs & the API base URL.

The base URL for API calls is set to `https://gitlab.com/api/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Gitlab REST API | ✅ |

## Gitlab API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- The [API Documentation](https://docs.gitlab.com/ee/api/) applies to both self-hosted instances as well as the Gitlab hosted SaaS version.

:::info Share your experience
Learned something about working with the Gitlab API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-gitlab.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::
