---
sidebar_label: 'Slack'
---

# Blueprint: Slack

This blueprint of Nango for the Slack API makes it very easy to work with the Slack Web API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Slack API homepage](https://api.slack.com/)  |  [Slack API Docs](https://api.slack.com/docs)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Slack blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    slack:
        extends_blueprint: slack:v0

        oauth_client_id: <YOUR SLACK CLIENT ID>
        oauth_client_secret: ${SLACK_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

### Coverage
Blueprint `v0` covers Slack OAuth 2 V2 and the Web API.

The base URL for API calls is set to ` https://slack.com/api/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  supports both bot and user tokens|
| Automatic token refresh | ✅ if your Slack app is opted in for token refreshes | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Slack Web API | ✅ |

## Slack API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Slack's Web API doesn't really have versioning, instead they publish all changes to [the changelog](https://api.slack.com/changelog). You can follow these through an RSS feed. Major breaking changes are announced well ahead of time there.
- Registering a new Slack app is fast & easy, no review required. Public distribution (so anybody can install it into their workspace) is also easy. If you want to get listed on the Slack Marketplace there are additional verification steps, plan this well ahead of time!
- Slack offers [additional parameters](https://api.slack.com/authentication/oauth-v2#obtaining) to customize the OAuth authorization screen. To use these just add these parameters to your integration like this:
```yaml title=integrations.yaml
    slack:
        extends_blueprint: slack:v0

        auth:
            authorization_params:
                team: <teamID>
```

:::info Share your experience
Learned something about working with the Slack API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-slack.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::

## Action Blueprints (WIP)
Find these on our [Github](https://github.com/NangoHQ/nango/tree/main/nango-integrations/slack), more coming soon.

| Action | Status | 
|---|---|
| Post message to channel | ✅ |