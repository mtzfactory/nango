---
sidebar_label: 'Greenhouse - Ingestion API'
---

# Blueprint: Greenhouse - Ingestion API

This blueprint of Nango for the Greenhouse API makes it very easy to work with the Greenhouse Ingestion API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Greenhouse Ingestion API Docs](https://developers.greenhouse.io/candidate-ingestion.html)  |  [API gotchas & learnings](#gotchas)

Last updated: 12.08.2022

## Pick the right Greenhouse API
Greenhouse has multiple APIs and because they use different authentication mechanisms there are also different Blueprints for them in Nango. Check the [Greenhouse API Overview](https://developers.greenhouse.io/) for a full list, currently Nango has Blueprints for the following:

- [Greenhouse Harvest API](blueprint-catalog/blueprint-greenhouse-harvest.md) (used to manage candidates, settings etc.)
- Greenhouse Ingestion API (this blueprint, used to send new candidates into Greenhouse from sourcing tools)

## How to use it
To create your own integration based on the Greenhouse Ingestion API blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    greenhouse-ingestion:
        extends_blueprint: greenhouse-ingestion:v0

        oauth_client_id: <YOUR GREENHOUSE CLIENT ID>
        oauth_client_secret: ${GREENHOUSE_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need
```
The oauth_ parameters are optional if you are not using Nango's builtin OAuth2 feature and the access token refresh.

Check the [gotchas](#gotchas) below for some more information on how to obtain your client id & secret, unfortunately the Greenhouse documentation is sparse on that to say the least...

### Coverage
Blueprint `v0` covers Greenhouse OAuth 2 and the Greenhouse Ingestion API.

The base URL for API calls is set to `https://api.greenhouse.io/v1/partner/`

| Nango Feature | Supported Status | 
|---|---|
| Builtin OAuth2 authentication | ✅  |
| Automatic token refresh | ✅  | 
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Greenhouse REST API | ✅ |

## Greenhouse Ingestion API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- To use the Ingestion API with OAuth you need to register your application with Greenhouse. Whilst the [docs list](https://developers.greenhouse.io/candidate-ingestion.html#authentication) what you need to send them to receive your client id & secret it does not list how and where to send these things. By digging around we found 3 email addresses which might be able to help you (if you know what the process is feel free to contribute that to this Blueprint guide, thank you ❤️):
    - partneronboarding@greenhouse.io (they claim for new partners looking to integrate)
    - partner-support@greenhouse.io (they claim for technical integration support)
    - partners@greenhouse.io (for general partner inquiries)
- The Ingestion API also supports Basic auth, but the process seems very user unfriendly and cumbersome (to us at least). We think OAuth is best for users (and you) whenever available, but if you want to use the Basic Auth version feel free to create your own integration configuration fot it by following our [auth guide](guides/auth.md). Nango fully supports that as well.

:::info Share your experience
Learned something about working with the Greenhouse Ingestion API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-greenhouse-ingestion.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::