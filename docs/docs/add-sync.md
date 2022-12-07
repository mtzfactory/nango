---
sidebar_label: 'Adding a Sync'
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

**All configuration fields are optional** (though you may need to provide the relevant ones for the external API request to succeed). 

If you want to see some examples of them in action take a look at the [real world examples](real-world-examples.md) page.

For all the "path" parameters you can use "." syntax to reference keys in nested objects: `paging.next.after`

<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import {Nango, NangoHttpMethod} from '@nangohq/node-client'

let config = {
    // External API HTTP request related
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

    // To fetch results & uniquely identify records
    response_path: 'data.results',  // The path to the result objects inside the external API response.
    unique_key: 'profile.email',    // The key in the result objects used for deduping (e.g. email, id) + enables Full Refresh + Upsert syncing mode.

    // Providing paging information in external requests (required for paging)
    paging_cursor_request_path: 'after',   // Provide the cursor request path for fetching the next page.

    // Extracting paging information from external responses (one and only one required for paging)
    paging_cursor_metadata_response_path: 'paging.next.after',   // Use a field in the response as cursor for the next page.
    paging_url_path: 'next',        // Alternatively, use a field in the response as URL for the next page.
    paging_cursor_object_response_path: 'id', // Alternatively, use a field of the response's last object as cursor for the next page.
    paging_header_link_rel: 'next', // Alternatively, use the Link Header to fetch the next page.

    // JSON-to-SQL schema mapping
    auto_mapping: true,             // Automatically map JSON objects returned from external APIs to SQL columns. Default: true.

    // Sync frequency
    frequency: 15,                  // In minutes

    // Authentication (leverages the Pizzly Oauth to automatically authenticate requests with OAuth APIs)
    pizzly_connection_id: "user1",  // The ID of the connection registered with Pizzly
    pizzly_provider_config_key: "hubspot",  // The key of the provider configuration registered with Pizzly
    
    // Convenience
    max_total: 100,                 // Limit the total number of total objects synced for testing purposes.
    friendly_name: 'My Sync',       // To print prettier logs.
    metadata: { company_id: 123 }   // Attach metadata to each synced row.
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

The **Full Refresh + Overwrite** mode is used by default. To use the **Full Refresh + Upsert** mode, provide a right value for the `unique_key` field in the [Sync config options](add-sync.md#sync-options), the value of which will be used to dedupe rows.

You can view your Sync configurations in the SQL table `_nango_syncs` and your Sync jobs in `_nango_jobs`.

### Syncing frequency

By default, Sync jobs run hourly by default. You can configure the Sync frequency with the `frequency` parameter in the [Sync config options](add-sync.md#sync-options).

## Database Storage

Nango stores both the synced data and Sync/Job configuration in a [Postgres database](https://www.postgresql.org).

For the synced data, Nango stores all the objects in their original JSON form in a table called `_nango_raw`. This single table contains the raw data from all Syncs combined.

Additionally, Nango supports optional [JSON-to-SQL mapping](add-sync.md#mapping). If enabled, each Sync in Nango will have its own table in postgres containing the transformed data from that Sync. The default name for Sync-specific SQL tables is `_nango_sync_[syncId]`.

### Use your own Postgres database & schema

By default, Nango creates a local Postgres database with credentials: 
```
host: localhost
port: 5432
user: nango
password: nango
database: nango
```

You can point Nango to a different database by adding the following environment variables to the `.env` file (in the root folder):

```
NANGO_DB_HOST=[your-host]
NANGO_DB_PORT=[your-port]
NANGO_DB_USER=[your-user]
NANGO_DB_NAME=[your-database-name]
NANGO_DB_PASSWORD=[your-password]
NANGO_DB_SSL=TRUE # Set to 'TRUE' if database requires SSL connections
```

By default, Nango will create and use a separate Postgres schema called `nango` to cleanly separate Nango-related data from the rest of your database.

You can use a different schema with the following environment variable:
```
NANGO_DB_SCHEMA=[your-preferred-schema]
```



## JSON-to-SQL schema mapping {#mapping}

### Auto Mapping

:::info
Automatically inferring a schema from API responses is tricky. If you run into issues or want to understand why your schema came out the way it did we are happy to help you in the [Slack community](https://nango.dev/slack)!

In the near future we will also support [custom mappings](#custommapping) which will give you full control over the destination schema of Nango's mapping.
:::

#### How Nango determines the schema
By default, Nango automatically maps the JSON objects returned from external APIs to SQL columns. The mapping rules are:
- Nested fields are flattened and the path is joined with `_` into a single column name
- Arrays are flattened into multiple columns with suffix `_[index]`
- Null values are ignored
- Data types are inferred, but currently only for these supported types: string, number, date, boolean

Here is an example: 

The following JSON response:

```json
{
  "field": true,
  "parent": {"nested": "string_value"},
  "nullField": null,
  "list": [1, 2]
}
```

turns into this SQL table: 

| field (boolean) | parent_nested (string)      | list_0 (number) | list_1 (number) |
| ----------- |----------- | ----------- | ----------- |
| true | string_value      | 1       | 2       |

#### How Nango treats data that does not align with the schema
Once a schema with data types has been generated, Nango will only store values in the SQL table that align with the data type of the schema.
As an example, let's assume the field `num_users` has type number and these objects get returned by the API:
```json
[
  {
    "name": "obj1",
    "num_users": 23
  },
  {
    "name": "obj2",
    "num_users": 182
  },
  {
    "name": "obj3",
    "num_users": "nango is great"
  }
]
```
In this case Nango would store the value of `num_users` for obj1 and obj2, but not for obj3 (because the type string is not compatible with the schema's type number).
  
#### How Nango deals with schema changes
Nango will also change the schema of the generated table if the schema of the API response changes.
Currently the following transformations are supported: 
- If a previously unseen field appears in the JSON, the relevant SQL column will be created (with the right data type)
- If a previously seen field is not present in the JSON nothing happens (if a field is there we store it's value, if its not there we just ignore that)
  

#### How to disable Auto Mapping
Auto mapping is on by default for new Syncs. You can disable Auto Mapping for an individual Sync by setting the `auto_mapping` field to `false` in the [Sync config options](add-sync.md#sync-options).

### Configure destination table

You can configure the destination db table of a Sync with the `mapped_table` parameter in the [Sync config options](add-sync.md#sync-options). 

You can also configure multiple Syncs to send data to the same destination  table. 

If you specify a table that does not already exist, it will be automatically generated. The schema for this table will be automatically updated based on the data to insert.

:::info
Do not include the database schema name in the `mapped_table` Config parameter. 

The `mapped_table` Config parameter is only taken into account if the `auto_mapping` Config parameter is `true` or omitted.
:::


### Custom Mapping (coming soon) {#custommapping}

We plan to introduce custom mappings soon. These will allow you to specify exactly (in code) how you want the JSON mapped to a SQL-table.
This will enable a few interesting features:
- Stable SQL schemas that are guaranteed not to change even as the API response changes (with optional alerts for response changes)
- The ability to map & merge several Syncs to the same SQL-table
- The ability to specify which fields should be extracted from the JSON (and which should be ignored)
- Optional, more complex transformations & mappings (e.g. combining data from multiple JSON-fields into one SQL column, transforming values etc.)


### Raw data

Nango stores all the objects, in their original JSON form, in a combined SQL table called `_nango_raw`.

## Attach metadata

You can attach arbitrary metadata to each synced row using the `metadata` field in the [Sync config options](add-sync.md#sync-options). 

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

Then, specify the `pizzly_connection_id` and `pizzly_provider_config_key` parameters in your [Sync config options](add-sync.md#sync-options).

To use Pizzly, with or without Nango, start [here](https://github.com/NangoHQ/Pizzly).


## Observability, logging & debugging

Observability is some of the most time-consuming infrastructure to set up when building external integrations in-house. To relieve engineering teams from this burden, Nango aims at building powerful out-of-the-box tooling for observing interactions with external APIs.

While we will continue to make Nango more observable, there are already multiple ways that you can observe and debug Nango Syncs:

### Inspect Sync jobs in the DB

You can access all the information about Sync job execution in Nango's destination database, in the table `_nango_jobs`. 

Each jobs displays information about: 
- Start and end time
- Status
- Error message (in case of failure)
- Error stack trace (in case of failure)
- Updated row count (in case of success)
- Attempt number

### Inspect logs

You can view the combined logs for all Nango containers, in real-time, with the command:
```
docker-compose logs --follow
```

By default, the logger logs info-level messages and above. You can make logs more verbose by setting `LOG_LEVEL` to `debug` (or less verbose by setting it to `error`) in the `.env` file.

### Temporal Admin Panel

Additionally, as Nango uses [Temporal](https://temporal.io/) to orchestrates Sync jobs, you can further debug Sync job executions by logging to the Temporal Admin Panel. 

To enable the Temporal UI, you should run the `debug` Docker Compose with the following command: 
```bash
docker-compose -f docker-compose.yaml -f docker-compose.debug.yaml up
```

You can now view, debug and control Temporal workflows (corresponding to Sync jobs) on the Temporal UI on http://localhost:8011.


## Problems with your Sync? We are here to help!

If you need help or run into issues, please reach out! We are online and responsive all day on the [Slack Community](https://nango.dev/slack).
