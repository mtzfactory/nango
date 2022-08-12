---
sidebar_label: 'Twitter'
---

# Blueprint: Twitter

This blueprint of Nango for the Twitter API makes it very easy to work with the Twitter REST API and automates common tasks such as OAuth 1.0a authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Twitter API Docs](https://developer.twitter.com/en/docs/platform-overview)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Twitter blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    twitter:
        extends_blueprint: twitter1:v0

        oauth_client_id: <YOUR TWITTER CLIENT ID>
        oauth_client_secret: ${TWITTER_CLIENT_SECRET}
        # See "gotchas" section on how to set scopes, Twitter does this in a non-standard way
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth 1.0a feature and the access token refresh.

### Coverage
Blueprint `v0` covers Twitter OAuth 1.0a and both the REST API V2 as well as all the legacy REST APIs.

The base URL for API calls is set to `https://api.twitter.com/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth1 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Twitter REST API | ✅ |

## Twitter API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- You need a **Twitter Developer account** to develop for the Twitter API. This requires an application with **manual approval**, which can take from **a few hours to up to 3 business days**. Apply early.
- Twitter offers OAuth 2 and OAuth 1.0a, but they serve different purposes: The OAuth 2 method is only supported for apps to make calls on their own behalf (e.g. a bot tweeting from their own account) whilst the OAuth 1.0a authentication allows you to act on behalf of any Twitter user (e.g. tweet for the person on their own account). This blueprint implements the OAuth 1.0a auth method only, contact us if you need OAuth2 support.
- Twitter only offers 2 different scopes (`write` and `read`) and they must be set in an obscure header on the request step. By default the Nango Blueprint requests a `write` scope, if you only require read access just use this snippet in your `integrations.yaml`:
```yaml title=integrations.yaml
    twitter:
        extends_blueprint: twitter:v0

        auth:
            request_params:
                x_auth_access_type: read # or "write", which is the default in the blueprint
```

:::info Share your experience
Learned something about working with the Twitter API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-twitter.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::