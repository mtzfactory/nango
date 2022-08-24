---
sidebar_label: 'Zoom'
---

# Blueprint: Zoom

This blueprint of Nango for the Zoom API makes it very easy to work with the Zoom API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Zoom API Docs](https://marketplace.zoom.us/docs/api-reference/introduction/)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Zoom blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    zoom:
        extends_blueprint: zoom:v0

        oauth_client_id: <YOUR ZOOM CLIENT ID>
        oauth_client_secret: ${ZOOM_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Zoom OAuth 2.0 and the Zoom REST API V2.

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  mandatory for all Zoom apps | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Zoom REST API | ✅ |

## Zoom API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Signing up for a dev account and getting OAuth credentials is easy, but to distribute your app (so any Zoom user can install it) you must go through a review process and submit the integration to be listed in the Marketplace. There is also an option though to Beta test your integration with some customers before you apply for review. Check the [Zoom Docs on public vs. private apps](https://marketplace.zoom.us/docs/guides/publishing/) for details.

:::info Share your experience
Learned something about working with the Zoom API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-zoom.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::