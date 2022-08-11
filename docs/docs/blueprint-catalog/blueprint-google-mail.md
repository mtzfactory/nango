---
sidebar_label: 'Google Mail (Gmail)'
---

# Blueprint: Google Mail (Gmail)

This blueprint of Nango for the Google Mail API makes it very easy to work with the Gmail REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Google Mail API Docs](https://developers.google.com/gmail/api)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Google Mail blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    google-mail:
        extends_blueprint: google-mail:v0

        oauth_client_id: <YOUR Google MAIL CLIENT ID>
        oauth_client_secret: ${GOOGLE_MAIL_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Google OAuth 2 V2 and the Gmail REST API V1.

The base URL for API calls is set to `https://www.googleapis.com/gmail/v1/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Google Mail REST API | ✅ |

## Google Mail API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- The OAuth flow for Google Mail and all other Google workspace products is the same, hence scopes can be interchanged between these.

:::info Share your experience
Learned something about working with the Google Mail API that you want to share with other developers? [Add it to this page](https://Google Mail.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-Google Mail.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::