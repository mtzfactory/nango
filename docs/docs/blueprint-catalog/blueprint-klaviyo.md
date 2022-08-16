---
sidebar_label: 'Klaviyo'
---

# Blueprint: Klaviyo

This blueprint of Nango for the Klaviyo API makes it very easy to work with the Klaviyo REST API and automates common tasks such as OAuth 2 authentication, requests authorization, logging, rate-limit handling, error handling and automatic retries.

[Klaviyo REST API Docs](https://developers.klaviyo.com/)  |  [API gotchas & learnings](#gotchas)

Last updated: 16.08.2022

## How to use it
To create your own integration based on the Klaviyo blueprint add this to your `integrations.yaml` file:

```yaml title=integrations.yaml
    klaviyo:
        extends_blueprint: klaviyo:v0
```

Because Klaviyo uses an api_key based authorization you need to [ask users for their api key](https://developers.klaviyo.com/en/docs/retrieve-api-credentials) (for the REST API you need a "private api key" as Klaviyo calls it) and the register it manually with Nango by calling the [registerConnection](reference/SDKs/node.md#registerConnection) method like this:

```js title="In your backend, using the Nango SDK"
let credentials = {
    api_key: '<Klaviyo "private api key" from your frontend/user>'
};

await nango.registerConnection('klaviyo', '<user-id>', credentials);
// Connection registered, you can now start executing Klaviyo actions for this user
```

### Coverage
Blueprint `v0` covers the Klaviyo REST API V1 & V2 (see gotchas).

The base URL for API calls is set to `https://a.klaviyo.com/api/`

| Nango Feature | Supported Status | 
|---|---|
| Rate limit detection | ✅ |
| Retries on timeout | ✅ |
| Use any endpoint of the Klaviyo REST API | ✅ |

## Klaviyo API gotchas & learnings {#gotchas}
_These are community contributed field notes about working with this API. We hope they help you!_

- Note that some endpoints use `v1` and some use `v2`, [according to Klaviyo](https://developers.klaviyo.com/en/reference/api-overview#versioning) this is by design and only V1 endpoints marked as deprecated are actually deprecated.
- Whilst the main focus of this Blueprint is the Klaviyo REST API, if needed the [backend track API](https://developers.klaviyo.com/en/docs/track-api-reference#back-end-tracking-events-server-side) can also be used. But in this case you need to store the public api key for this yourself (for instance in the `additionalConfig` property of the user's connection, see [working with user Connections guide](guides/user-connections.md#additionalConfig)).

:::info Share your experience
Learned something about working with the Klaviyo API that you want to share with other developers? [Add it to this page](https://github.com/NangoHQ/nango/edit/main/docs/docs/blueprint-catalog/blueprint-klaviyo.md) (it is just a markdown file) and send us a pull request. Thanks so much!
:::