import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Creating & managing Syncs


Adding a Sync to Nango is quick & easy. If you have not read the [core concepts](core-concepts.md) yet please do so first: From here on out we assume you are familiar with Syncs and how they work together with your application.

## 3 quick steps to add a new Sync

We recommend the following steps when you add a new Sync to Nango:
1. Make sure the API request works as expected (using Postman, a script, CLI etc.)
2. Look at the Sync options below and configure them for your Sync
3. Run your code once and make sure Nango syncs your data as expected

## Sync options {#sync-options}

This example shows you all the possible configuration options for a Nango Sync. 

**All configuration fields are optional** (though you may need to provide the relevant ones for the external API request to succeed). 

If you want to see some examples of them in action take a look at the [real world examples](real-world-examples.md) page.

For all the "path" parameters you can use "." syntax to reference keys in nested objects: `paging.next.after`

<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import {Nango, NangoHttpMethod} from '@nangohq/node-client'

let config = {
    //==================
    // Config for the HTTP request to the 3rd party API
    //==================
    method: NangoHttpMethod.Get,    // The HTTP method of the external REST API endpoint (GET, POST, etc.). Default: GET.
    headers: {                      // HTTP headers to send along with every request to the external API (e.g. auth header).
        'Accept': 'application/json'
    },
    body: {                         // HTTP body to send along with every request to the external API.
        'mykey': 'A great value'
    },
    query_params: {
        'mykey': 'A great value'    // URL query params to send along with every request to the external API.
    },

    //==================
    // Fetching records & uniquely identifying them
    //==================
    response_path: 'data.results',  // The path to the result objects inside the external API response.
    unique_key: 'profile.email',    // The key in the result objects used for deduping (e.g. email, id) + enables Full Refresh + Upsert syncing mode.
    metadata: {                     // Will be attached to every synced record. 1 column per key.
        user_id: 123,
        company: 'supercorp'
    }

    //==================
    // Pagination
    //==================

    // Providing paging information in external requests (required for paging)
    paging_cursor_request_path: 'after',   // Provide the cursor request path for fetching the next page.

    // Extracting paging information from external responses (one and only one required for paging)
    paging_cursor_metadata_response_path: 'paging.next.after',   // Use a field in the response as cursor for the next page.
    paging_url_path: 'next',        // Alternatively, use a field in the response as URL for the next page.
    paging_cursor_object_response_path: 'id', // Alternatively, use a field of the response's last object as cursor for the next page.
    paging_header_link_rel: 'next', // Alternatively, use the Link Header to fetch the next page.

    //==================
    // JSON-to-SQL schema mapping (for details see "Schema mappings" in the sidebar)
    //==================
    auto_mapping: true,             // Automatically map JSON objects returned from external APIs to SQL columns. Default: true.
    mapped_table: 'example_table'   // The name of the table in the database where the results should be stored.

    //==================
    // Sync frequency
    //==================
    frequency: 60,                  // Sync interval in minutes. Default: 60

    //==================
    // Authentication (only needed for OAuth, leverages Pizzly)
    //==================
    pizzly_connection_id: "user1",  // The ID of the connection registered with Pizzly
    pizzly_provider_config_key: "hubspot",  // The key of the provider configuration registered with Pizzly
    
    //==================
    // Convenience features
    //==================
    max_total: 100,                 // Limit the total number of total objects synced for testing purposes.
    friendly_name: 'My Sync',       // Human readable name, will be used in logs & observability.
};

// Add the Sync
new Nango().sync('https://api.example.com/my/endpoint?query=A+query', config);
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```json
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '{
// External API endpoint URL
"url": "https://api.example.com/my/endpoint?query=A+query",

// External API HTTP request related
"method": "GET", // The HTTP method of the external REST API endpoint (GET, POST, etc.). Default: "GET".
"headers": { "Accept": "application/json"}, // HTTP headers to send along with every request to the external API (e.g. auth header).
"body": { "mykey": "A great value"}, // HTTP body to send along with every request to the external API.
"query_params": { "mykey": "A great value"}, // URL query params to send along with every request to the external API.

// To fetch results & uniquely identify records
"response_path": "data.results", // The path to the result objects inside the external API response.
"unique_key": "profile.email", // The key in the result objects used for deduping (e.g. email, id) + enables Full Refresh + Upsert sync mode.

// Providing paging information in external requests (required for paging)
"paging_cursor_request_path": "after", // Provide the cursor request path for fetching the next page.

// Extracting paging information from external responses (one and only one required for paging)
"paging_cursor_metadata_response_path": "next", // Use a field in the response as cursor for the next page.
"paging_url_path": "next", // Alternatively, use a field in the response as URL for the next page.
"paging_cursor_object_response_path": "id", // Alternatively, use a field of the response last object as cursor for the next page.
"paging_header_link_rel": "next", // Alternatively, use the Link Header to fetch the next page.

// JSON-to-SQL schema mapping
"auto_mapping": true, // Automatically map JSON objects returned from external APIs to SQL columns. Default: true.

// Sync frequency
"frequency": 15,  // In minutes

// Authentication (leverages the Pizzly Oauth to automatically authenticate requests with OAuth APIs)
"pizzly_connection_id": "user1",  // The ID of the connection registered with Pizzly
"pizzly_provider_config_key": "hubspot",  // The key of the provider configuration registered with Pizzly

// Convenience
"max_total": 100 // Limit the total number of total objects synced for testing purposes.
"friendly_name": "My Sync",  // To print prettier logs.
"metadata": { "company_id": 123 }  // Attach metadata to each synced row.
}'
  ```
  </TabItem>
</Tabs>

## Syncing modes & frequency

### Syncing modes

Nango supports the following syncing modes:
- **Full Refresh + Overwrite**: on each job, read all the objects from the API, overwrite by first deleting existing rows
- **Full Refresh + Upsert**: on each job, read all the objects from the API, append new rows & update existing rows (see below)
- **Incremental + Upsert** (coming soon): on each job, only read the new/updated objects from the API, append new rows & update existing rows

The **Full Refresh + Overwrite** mode is used by default. To use the **Full Refresh + Upsert** mode, provide a right value for the `unique_key` field in the [Sync config options](managing-syncs.md#sync-options), the value of which will be used to dedupe rows.

You can view your Sync configurations in the SQL table `_nango_syncs` and your Sync jobs in `_nango_jobs`.

### Syncing frequency

By default, Sync jobs run hourly by default. You can configure the Sync frequency with the `frequency` parameter in the [Sync config options](managing-syncs.md#sync-options).


## Attach metadata

You can attach arbitrary metadata to each synced row using the `metadata` field in the [Sync config options](managing-syncs.md#sync-options). 

This is useful if you want to query the synced data based on fields from your other SQL tables (e.g. `user_id`, `company_id`, etc.).

## Pagination
Nango currently supports two types of pagination, with more in the works. Your favorite API is not compatible? [Open a github issue](https://github.com/NangoHQ/nango/issues/new) with a link to the endpoint documentation and a sample response and we are happy to make it work for you! Or reach out on our Slack community and we will do our best to help.

### Cursor based pagination
The API returns a cursor that points at the next page, which should be passed along with the request in a special parameter (for example `after`).

**If the cursor field is in the metadata pf the response:**

Example response:
```json
{
  "results": [ ... ],
  "paging": {
    "next": {
      "after": "NTI1Cg%3D%3D",
      "link": "?after=NTI1Cg%3D%3D"
    }
  }
}
```

=> use the `paging_cursor_metadata_response_path` (here set to `paging.next.after`) and `paging_cursor_request_path` (here set to `after`) config parameters of Nango.

**If the cursor field is in the last object of the response:**

Example response:
```json
{
  "results": [ 
    {},
    ...,
    {
      "cursor": "NTI1Cg%3D%3D"
    }
  ]
}
```

=> If the cursor field is in the last object of the response, use the `paging_cursor_object_response_path` (here set to `cursor`) and `paging_cursor_request_path` (here set to `after`) config parameters of Nango.


### "Next URL" based pagination
The API returns a URL where the next page of results can be fetched.

**If the URL is returned in the body of the response:**

Example response body:
```json
{
    "results": [ ... ],
    "next": "https://api.example.com/docs?nextPage=2749ns92md"
}
```

=> Use the `paging_url_path` config parameter of Nango, here set to `next`

**If the URL is returned as a Link header of the response:**

Example response header:
```json
{ "link": "'<https://api.github.com/user/2560456/repos?per_page=10&page=2>; rel=\"next\", <https://api.github.com/user/2560456/repos?per_page=10&page=3>; rel=\"last\"'" }
```

=> Use the `paging_header_link_rel` config parameter of Nango, here set to `next`

## OAuth

Nango leverages our sister project [Pizzly](https://github.com/NangoHQ/Pizzly) to handle authentication with OAuth APIs. 

Pizzly + Nango will let you: 
- Initiate OAuth user authentication flows from your frontend with the Pizzly frontend SDK
- Let Nango automatically authenticate requests, using access tokens maintained fresh by Pizzly

To leverage Pizzly in Nango, you only need to set the `PIZZLY_BASE_URL` environment variable in the `.env` file at the root of Nango's folder. 

Then, specify the `pizzly_connection_id` and `pizzly_provider_config_key` parameters in your [Sync config options](managing-syncs.md#sync-options).

To use Pizzly, with or without Nango, start [here](https://github.com/NangoHQ/Pizzly).

## Problems with your Sync? We are here to help!

If you need help or run into issues, please reach out! We are online and responsive all day on the [Slack Community](https://nango.dev/slack).