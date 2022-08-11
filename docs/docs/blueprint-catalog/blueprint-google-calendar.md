---
sidebar_label: 'Google Calendar'
---

# Blueprint: Google Calendar

This blueprint of Nango for the Google Calendar API makes it very easy to work with the Google Calendar REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Google Calendar API Docs](https://developers.google.com/calendar/api)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Google Calendar blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    google-calendar:
        extends_blueprint: google-calendar:v0

        oauth_client_id: <YOUR GOOGLE CALENDAR CLIENT ID>
        oauth_client_secret: ${GOOGLE_CALENDAR_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Google OAuth 2 V2 and the Google Calendar REST API V3.

The base URL for API calls is set to `https://www.googleapis.com/calendar/v3/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Google Calendar REST API | ✅ |

## Google Calendar API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- The OAuth flow for Google Calendar and all other Google workspace products is the same, hence scopes can be interchanged between these.

:::info Share your experience
Learned something about working with the Google Calendar API that you want to share with other developers? [Add it to this page](https://Google Calendar.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-Google Calendar.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::