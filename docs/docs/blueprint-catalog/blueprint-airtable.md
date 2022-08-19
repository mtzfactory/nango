---
sidebar_label: 'Airtable'
---

# Blueprint: Airtable

This blueprint of Nango for the Airtable API makes it very easy to work with the Airtable REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Airtable API Docs](https://airtable.com/api)  |  [API gotchas & learnings](#gotchas)

Last updated: 10.08.2022

## How to use it
To create your own integration based on the Airtable blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    airtable:
        extends_blueprint: airtable:v0

        app_api_key: ${AIRTABLE_CLIENT_SECRET} # Needed for the Metadata API, see gotchas below. This is need in addition to the user's api key.
```

Because Airtable uses an api_key based authorization you need to ask users for their api key and the register it manually with Nango by calling the [registerConnection](reference/SDKs/node.md#registerConnection) method like this:

```js title="In your backend, using the Nango SDK"

let credentials = {
    api_key: '<Airtable "api key" from your frontend/user>'
};

await nango.registerConnection('airtable', '<user-id>', credentials);
// Connection registered, you can now start executing Airtable actions for this user
```

### Coverage
Blueprint `v0` covers Airtable with api key based authorization and the Base & Meta REST API.

The base URL for API calls is set to `https://api.airtable.com/`

| Nango Feature | Supported Status | 
|---|---|
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Airtable REST API | ✅ |

## Airtable API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- You need to sign up for a free account and add at least one "base" to your account to view the API docs. Once you have done so you can find links to both the REST API docs for any base and for the Meta API at [https://airtable.com/api](https://airtable.com/api).
- Note that at (as of the time of this writing) the rate limits of the main Base REST API is 5 requests per second. This together with fairly small maximum page sizes means that dumping larger amounts of data can quite quickly take longer, which might be problematic if you work with this API from lambdas with a limited runtime (though this is not an issue with Nango, we don't impose runtime limits on Actions).
- Whilst the Base REST API (which allows you to query data from a base) only requires the user's api key the [Metadata API](https://airtable.com/api/meta) requires an additional "client secret" that is unique to your app/integration. You need to apply for this client secret with Airtable, the link for the form is on the Metadata API docs page. Once you have it pass it into Nango as your `app_api_key` (see How-to above). Nango automatically adds it to the right header parameter for you (as specified in the Blueprint).
- Users can generate & view their api key on their [account](https://airtable.com/account) page.

:::info Share your experience
Learned something about working with the Airtable API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-airtable.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::