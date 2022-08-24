---
sidebar_label: 'Notion'
---

# Blueprint: Notion

This blueprint of Nango for the Notion API makes it very easy to work with the Notion REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Notion REST API Docs](https://developers.notion.com/docs)  |  [API gotchas & learnings](#gotchas)

Last updated: 16.08.2022

## How to use it
To create your own integration based on the Notion blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    notion:
        extends_blueprint: notion:v0

        oauth_client_id: <YOUR NOTION CLIENT ID>
        oauth_client_secret: ${NOTION_CLIENT_SECRET}
        oauth_scopes: '' # Empty string here is required. Notion's API doesn't have scopes yet, see gotchas for details
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Notion OAuth 2 and the Notion REST API.

The base URL for API calls is set to `https://api.notion.com`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Notion REST API | ✅ |

## Notion API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- When the user authorizes your app they will get to pick the pages and databases your app has access to, you can find an example of this flow [here](https://developers.notion.com/docs/authorization#user-grants-access) or try it yourself. Currently this is the only "scope" Notion's API supports and you hence have always full read & write access on all pages the user grants you.
- The Notion API returns more details along with the access token such as the workspace ID, workspace name & Icon, see the [full list here](https://developers.notion.com/docs/authorization#exchanging-the-grant-for-an-access-token) (its the table just after the HTTP snippet). You can access these in the NangoAction with the [getCurrentConnection](reference/actions.md#getCurrentConnection) object.

:::info Share your experience
Learned something about working with the Notion API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-notion.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::