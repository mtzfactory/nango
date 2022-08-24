---
sidebar_label: 'MS Teams'
---

# Blueprint: Microsoft Teams

This blueprint of Nango for the MS Teams API makes it very easy to work with the MS Teams REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[MS Teams API Docs](https://docs.microsoft.com/en-us/graph/teams-concept-overview)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the MS Teams blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    ms-teams:
        extends_blueprint: ms-teams:v0

        oauth_client_id: '<YOUR MS TEAMS CLIENT ID>' # Make sure to quote it so YAML parses it as a string
        oauth_client_secret: ${MS_TEAMS_CLIENT_SECRET}
        oauth_scopes:
            - offline_access     # Most likely you want this scope, see note below
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

If you do not request `offline_access` the access token will expire after 65mins and Nango will not be able to refresh it (the user will have to re-authorize your app with the OAuth flow).

### Coverage
Blueprint `v0` covers MS Teams OAuth 2 V2 and the V1 REST API.

The base URL for API calls is set to `https://graph.microsoft.com/v1.0/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the MS Teams REST API | ✅ |

## MS Teams API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- This Blueprint builds on the Microsoft Graph API. Integrating with Teams is a common use case for this, but the API also supports many other Microsoft services which you can all access with this Blueprint.
- To access the Graph API you need to [register your application](https://docs.microsoft.com/en-us/graph/auth-register-app-v2) in the Azure Portal's Active Directory section. Weirdly enough Microsoft will let you access the Azure portal even if your Microsoft account has never signed up for Azure before, but will then throw access errors when you try to access the Active Directory part. If you encounter this make sure you actually signed up for Azure first.
- To develop and test Microsoft Teams related integrations you will need...access to MS Teams, which is only possible with a Microsoft Business account. You can get this for free by [joining the MS 365 Developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).
- **If you want to build a Teams notifications integration:** You would think posting as a bot to Microsoft Teams is easy. Here is what we found: Whilst the Graph API does support getting credentials for your application, so you can act in the name of your application and not as any specific user, the MS Teams part of the API does not support this functionality for posting messages to a channel. This means that your app can not post messages to a channel in its own name (like you would as a Slack bot). You have two options:
    - You can post messages in the name of any MS Teams user who has authenticated your integration (whilst not the cleanest, this is by far the easiest solution for both you and your users). For an example of this check out the Actions listed below.
    - You can create an [MS Teams bot app](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/what-are-bots). Note that this is not a REST API, instead you build & package an application (as in code & assets), deploy it to Microsoft and list it in the MS Teams App Store (which also requires Microsoft approval). Your users then first need to install your app into their Teams account from the App Store and then authorize it to get access to a channel. Once this is done you can trigger the packaged bot with an HTTP request from your server. Check the Microsoft docs for tutorials on this.

:::info Share your experience
Learned something about working with the MS Teams API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-microsoft-teams.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::

## Action Blueprints (WIP)
Find these on our [Github](https://github.com/NangoHQ/nango/tree/main/nango-integrations/ms-teams), more coming soon.

| Action | Status | 
|---|---|
| List all channels of all teams of a user | ✅ |
| Post message to channel | ✅ |