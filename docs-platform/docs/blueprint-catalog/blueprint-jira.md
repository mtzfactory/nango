---
sidebar_label: 'Jira (& Confluence)'
---

# Blueprint: Jira

This blueprint of Nango for the Jira API makes it very easy to work with the Jira REST APIs and Confluence REST APIs and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Jira API Docs](https://developer.atlassian.com/cloud/jira/platform/rest/)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Jira blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    jira:
        extends_blueprint: jira:v0

        oauth_client_id: <YOUR JIRA CLIENT ID>
        oauth_client_secret: ${JIRA_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Jira OAuth 2 and all Jira APIs (e.g. Jira Cloud platform, Jira Software Cloud, Jira Service Management Cloud etc.) as well as the [Confluence REST API](https://developer.atlassian.com/cloud/confluence/rest/intro/)

The base URL for API calls is set to `https://api.atlassian.com/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Jira & Confluence API | ✅ |

## Jira API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- You also need to set the scope of your app in the app settings, otherwise you will get an error on authorization
- To make API calls to the JIRA api you need to set the user's cloud ID as part of the path. You can retrieve the necessary cloud ID(s) as [documented here](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#3-1-get-the-cloudid-for-your-site) (Nango will automatically set the required Authorization header for you). We recommend you store the cloud id on the user's Connection object in Nango so you can easily add it to the request in the Action when needed.

:::info Share your experience
Learned something about working with the Jira API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-jira.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::