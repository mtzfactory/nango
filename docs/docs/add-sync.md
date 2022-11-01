---
sidebar_label: 'Adding a Sync'
sidebar_position: 4
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Adding a Sync to Nango

Adding a Sync to Nango is quick & easy. If you are not sure yet what a Sync is please take a look at our [Architecture](architecture.md) page.

## Add a Sync in minutes
You can think of Syncs as HTTP requests that Nango periodically runs for you to get the latest data.

We recommend the following steps when you add a new Sync to Nango:
1. Make sure the API request works as expected (using Postman, a script, CLI etc.)
2. Look at the `Nango.sync` (or REST API) call options below and configure them for your Sync
3. Run your code once and make sure Nango syncs your data as expected

## `Nango.sync` options

This example shows you all the possible configuration options for a Nango Sync.

If you want to see some examples of them in action take a look at the [real world examples](real-world-examples.md) page.

For all the "path" parameters you can use "." syntax to reference keys in nested objects: `paging.next.after`

<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import {Nango, NangoHttpMethod} from '@nangohq/node-client'

let nango_options = {
    // HTTP request related
    method: NangoHttpMethod.Get,    // The HTTP method of the external REST API endpoint (GET, POST, etc.).
    headers: {                      // HTTP headers to send along with every request to the external API (e.g. auth header).
        'Accept': 'application/json'
    },
    body: {                         // HTTP body to send along with every request to the external API.
        'mykey': 'A great value'
    },

    // To fetch results & uniquely identify records
    response_path: 'results',       // The path to the result objects inside the external API response.
    unique_key: 'id',               // The key in the result objects used for deduping (e.g. email, id).

    // For cursor based paging
    paging_request_path: 'after',   // The name of the request parameter for the next page cursor.
    paging_response_path: 'paging.next.after',   // The path in the response to the cursor for the next page.

    // For URL based paging
    paging_url_path: 'next'        // The path in the response to the URL for the next page.
};

// Add the Sync
Nango.sync('https://api.example.com/my/endpoint?query=A+query', nango_options);
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```bash
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '
 {
"url": "https://api.example.com/my/endpoint?query=A+query",
"method": "GET",
"headers": { "Accept": "application/json"},
"body": { "mykey": "A great value"},

"response_path": "results",
"unique_key": "name",

"paging_request_path": "after",
"paging_response_path": "next",

"paging_url_path": "next"
}'
  ```
  </TabItem>
</Tabs>


## Which pagination types does Nango support?
Nango currently supports two types of pagination, with more in the works. Your favorite API is not compatible? [Open a github issue](https://github.com/NangoHQ/nango/issues/new) with a link to the endpoint documentation and a sample response and we are happy to make it work for you! Or reach out on our Slack community and we will do our best to help.

### Cursor based pagination
The API returns a cursor that points at the next page, which should be passed along with the request in a special parameter (for example `after`).

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

=> Use the `paging_response_path` (here set to `paging.next.after`) and `paging_request_path` (here set to `after`) config parameters of Nango.


### "Next URL" based pagination
The API returns a URL where the next page of results can be fetched.

Example response:
```json
{
    "results": [ ... ],
    "next": "https://api.example.com/docs?nextPage=2749ns92md"
}
```

=> Use the `paging_url_path` config parameter of Nango, here set to `next`

## Problems with your Sync? We are happy to help!

If you run into issues, limitations or problems when setting up your Sync please reach out! We are online on our [Slack Community](https://nango.dev/slack) all day and happy to help you resolve whatever is needed to make Nango work for you and your Syncs.
