---
sidebar_label: 'Adding a Sync'
sidebar_position: 4
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Adding a Sync to Nango

Adding a Sync to Nango is quick & easy. If you are not sure yet what a Sync is please take a look at our [Architecture](architecture.md) page.

## Add a Sync in minutes

:::tip
You can think of Syncs as HTTP requests that Nango periodically runs for you to get the latest data.
:::

We recommend the following steps when you add a new Sync to Nango:
1. Make sure the API request works as expected (using Postman, a script, CLI etc.)
2. Look at the `Nango.sync` (or REST API) call options below and configure them for your Sync
3. Run your code once and make sure Nango syncs your data as expected

## `Nango.sync` options {#sync-options}

This example shows you all the possible configuration options for a Nango Sync.

If you want to see some examples of them in action take a look at the [real world examples](real-world-examples.md) page.

For all the "path" parameters you can use "." syntax to reference keys in nested objects: `paging.next.after`

<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import {Nango, NangoHttpMethod} from '@nangohq/node-client'

let config = {
    // External API HTTP request related
    method: NangoHttpMethod.Get,    // The HTTP method of the external REST API endpoint (GET, POST, etc.).
    headers: {                      // HTTP headers to send along with every request to the external API (e.g. auth header).
        'Accept': 'application/json'
    },
    body: {                         // HTTP body to send along with every request to the external API.
        'mykey': 'A great value'
    },
    query_params: {
        'mykey': 'A great value'    // URL query params to send along with every request to the external API.
    },

    // To fetch results & uniquely identify records
    response_path: 'results',       // The path to the result objects inside the external API response.
    unique_key: 'id',               // The key in the result objects used for deduping (e.g. email, id).

    // Providing paging information in external requests (required for paging)
    paging_cursor_request_path: 'after',   // Provide the cursor request path for fetching the next page.

    // Extracting paging information from external responses (one and only one required for paging)
    paging_cursor_metadata_response_path: 'paging.next.after',   // Use a field in the response as cursor for the next page.
    paging_url_path: 'next',        // Alternatively, use a field in the response as URL for the next page.
    paging_cursor_object_response_path: 'id', // Alternatively, use a field of the response's last object as cursor for the next page.
    paging_header_link_rel: 'next', // Alternatively, use the Link Header to fetch the next page.
    
    // Convenience
    max_total: 100                  // Limit the total number of total objects synced for testing purposes.
};

// Add the Sync
Nango.sync('https://api.example.com/my/endpoint?query=A+query', config);
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
"method": "GET", // The HTTP method of the external REST API endpoint (GET, POST, etc.).
"headers": { "Accept": "application/json"}, // HTTP headers to send along with every request to the external API (e.g. auth header).
"body": { "mykey": "A great value"}, // HTTP body to send along with every request to the external API.
"query_params": { "mykey": "A great value"}, // URL query params to send along with every request to the external API.

// To fetch results & uniquely identify records
"response_path": "results", // The path to the result objects inside the external API response.
"unique_key": "name", // The key in the result objects used for deduping (e.g. email, id).

// Providing paging information in external requests (required for paging)
"paging_cursor_request_path": "after", // Provide the cursor request path for fetching the next page.

// Extracting paging information from external responses (one and only one required for paging)
"paging_cursor_metadata_response_path": "next", // Use a field in the response as cursor for the next page.
"paging_url_path": "next", // Alternatively, use a field in the response as URL for the next page.
"paging_cursor_object_response_path": "id", // Alternatively, use a field of the response last object as cursor for the next page.
"paging_header_link_rel": "next", // Alternatively, use the Link Header to fetch the next page.

// Convenience
"max_total: 100 // Limit the total number of total objects synced for testing purposes.
}'
  ```
  </TabItem>
</Tabs>

## Syncing modes

Sync jobs run hourly by default. This frequency will be configurable both from code and the CLI in the near future.

Nango supports the following syncing modes:
- **Full Refresh + Overwrite**: on each job, read all objects from API, overwrite by first deleting existing rows
- **Full Refresh + Upsert**: on each job, read all objects from API, append new rows & update existing rows
- **Incremental + Upsert** (coming soon): on each job, only read new/updated objects from API, append new rows & overwrite updated rows

The **Full Refresh + Overwrite** mode is used by default. To use the **Full Refresh + Upsert** mode, provide a the right value to the `unique_key` field, used for deduping rows, in the [Sync config options](add-sync.md#sync-options).

You can view your sync configurations in the SQL table `_nango_syncs` and your sync jobs in `_nango_jobs`.

## JSON-to-SQL schema mapping

### Auto mapping

By default, Nango automatically maps the JSON objects returned from external APIs to SQL columns. The mapping rules are:
- Nested fields are flattened and the path is joined with `_` into a single column name
- Arrays are flattened into multiple columns with suffix `_[index]`
- Null values are ignores
- Data types are inferred among the following types: string, number, date, boolean

Example: 

JSON response:

```JSON
{
  'field': true,
  'parent': {'nested': 'string_value'},
  'nullField': null,
  'list': [1, 2]
}
```

becomes in SQL: 

| field (boolean) | parent_nested (string)      | list_0 (number) | list_1 (number) |
| ----------- |----------- | ----------- | ----------- |
| true | string_value      | 1       | 2       |



### Custom mapping (coming soon)

You will be able to specify, in code: 
- What destination table should each sync point to
- What fields should be extracted from the external API
- What SQL column each field should map to
- Optional field transformations & combinations

### Raw data

Nango stores all the objects, in their original JSON form, in a combined SQL table called `_nango_raw`.


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

## Problems with your Sync? We are happy to help!

If you run into issues, limitations or problems when setting up your Sync please reach out! We are online on our [Slack Community](https://nango.dev/slack) all day and happy to help you resolve whatever is needed to make Nango work for you and your Syncs.
