---
sidebar_label: 'Adding a Sync'
sidebar_position: 4
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Adding a Sync to Nango

This guide walks you through adding a Sync to Nango and making sure it works. If you are not sure yet what a Sync is please take a look at our [Architecture](architecture.md) page.


## Adding is as easy as 1-2-3
You can think of Syncs as HTTP requests that Nango periodically runs for you to get the latest data.

We thus recommend the following process to add a new Sync to Nango:
1. Make sure the API request works as expected (using Postman, a script, CLI etc.)
2. Go through the steps below to configure your `Nango.sync` (or REST API) call for your sync
3. Run your code once and make sure Nango Syncs your data as expected

## Step 1: Add a basic `Nango.sync` call
The first step is to add all the basic HTTP call parameters that you would otherwise also add to your request.


<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import {Nango, NangoHttpMethod} from '@nangohq/node-client'

let nango_options = {
    method: NangoHttpMethod.Get,    // The HTTP method, see NangoHttpMethod for a full list
    headers: {                      // HTTP headers to send along with every request
        'Accept: application/json'
    },
    body: {                         // Optional, will be JSON encoded
        'mykey': 'A great value'
    }
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
"body": { "mykey": "A great value"}
}'
  ```
  </TabItem>
</Tabs>

## Step 2: Tell Nango where to find the results array
Now that Nango can run your HTTP request it needs to know where to find the array of results you want to sync.

Nango will monitor the objects in this array for changes and sync any changes to your database.

Here is an example response from the Poké API that returns all Pokémons: [`https://pokeapi.co/api/v2/pokemon`](https://pokeapi.co/api/v2/pokemon)

```json
{
  "count": 1154,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    },
    ...
}
```

Our results array is under the `results` key, so we tell Nango this with the `response_path` option:
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts {11}
import {Nango, NangoHttpMethod} from '@nangohq/node-client'

let nango_options = {
    method: NangoHttpMethod.Get,    // The HTTP method, see NangoHttpMethod for a full list
    headers: {                      // HTTP headers to send along with every request
        'Accept: application/json'
    },
    body: {                         // Optional, will be JSON encoded
        'mykey': 'A great value'
    },
    response_path: 'results'        // The path in the response object to the array with our results
};

// Add the Sync
Nango.sync('https://api.example.com/my/endpoint?query=A+query', nango_options);
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```bash {10}
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '
 {
"url": "https://api.example.com/my/endpoint?query=A+query",
"method": "GET",
"headers": { "Accept": "application/json"},
"body": { "mykey": "A great value"},
"response_path": "results"
}'
  ```
  </TabItem>
</Tabs>

:::tip
Whilst we recommend always setting the `response_path`, the value is actually optional. If you do not set a `response_path` option Nango will default to looking for a top level key named `results` (and will fail if this does not exist).
:::

### What if the result is not at the top level?
If the results array is not under a top level key you can use the "dot" notation to specify the nested key. Take a look at this example response from an API:
```json
{
    "status": "ok",
    "code": 200,
    "returned": {
        "data": {
            "objects": [
                {
                    "id": 1,
                    "name": "Result"
                },
                { 
                    "id": 2,
                    "name": "Another result"
                }
            ]
        }
    }
}
```

In this case the correct `response_path` would be `returned.data.objects`.


## Step 3: Tell Nango how to identify a unique result object
Nango will automatically detect if an object is new (and should be added to your database) or if an existing object has been updated. Nango does so by looking at the value of a key you marked as unique: If the value in this key is new Nango will create a new object in your database. Otherwise, if it already exists in your database, Nango will update all the fields of the existing object with their new values. This type of behavior is sometimes referred to as an "Upsert".

A good unique key:
- Exists for every object (it shouldn't be an optional field)
- Is also a unique key for the external system/API (e.g. the id of the record or the user's email address if that is guaranteed to be unique)

With the `unique_key` option you can tell Nango which key in the results object you want to make unique.

For our Pokémon API example the Pokémon's name is the unique key, no two Pokémons can have the same name. Remember our API response for [`https://pokeapi.co/api/v2/pokemon`](https://pokeapi.co/api/v2/pokemon)

```json
{
  "count": 1154,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    {
      "name": "bulbasaur",
      "url": "https://pokeapi.co/api/v2/pokemon/1/"
    },
    {
      "name": "ivysaur",
      "url": "https://pokeapi.co/api/v2/pokemon/2/"
    },
    ...
}
``` 

Let's add this to our Nango sync options:
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts {12}
import {Nango, NangoHttpMethod} from '@nangohq/node-client'

let nango_options = {
    method: NangoHttpMethod.Get,    // The HTTP method, see NangoHttpMethod for a full list
    headers: {                      // HTTP headers to send along with every request
        'Accept: application/json'
    },
    body: {                         // Optional, will be JSON encoded
        'mykey': 'A great value'
    },
    response_path: 'results',       // The path in the response object to the array with our results
    unique_key: 'name',         // The key in the results object which identifies a unique record
};

// Add the Sync
Nango.sync('https://api.example.com/my/endpoint?query=A+query', nango_options);
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```bash {11}
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
"unique_key": "name"
}'
  ```
  </TabItem>
</Tabs>

## Step 4: Adding support for pagination
Once you tell Nango how pagination works for the API you are syncing we will handle it automatically for you. We currently support the most common pagination tactics, see one we are missing? Please [open a Github issue](https://github.com/NangoHQ/nango/issues/new) with an example and will be happy to add support for it!

### Cursor & request parameter based pagination
Many APIs return a cursor for pagination which you can pass as a request parameter for the next request to get to the next page.

As an example take a look at the [Hubspot Contacts API](https://developers.hubspot.com/docs/api/crm/contacts), it lists a request parameter called `after` and in the response there is a cursor ID with the value for next to get the next page:
```json
{
  "results": [
    {
      ...
    }
  ],
  "paging": {
    "next": {
      "after": "NTI1Cg%3D%3D",
      "link": "?after=NTI1Cg%3D%3D"
    }
  }
}
```

Nango supports this kind of pagination with the config parameters:
- `paging_requests_path` tells Nango the parameter name where the cursor should be placed, in our Hubspot example this would be set to `after`
- `paging_response_path` tells Nango where in the response the cursor value can be found. In our HubSpot example above this is `paging.next.after`

### URL Cursor based pagination
Some APIs return a next URL instead of a cursor value, for instance the Poké API makes use of this kind of pagination:
```json
{
  "count": 1154,
  "next": "https://pokeapi.co/api/v2/pokemon?offset=20&limit=20",
  "previous": null,
  "results": [
    ...
  ]
}
```

If you use the `paging_respone_path` option to tell Nango where it can find these pagination cursors it will automatically follow them to get all the pages. So in our example above we would just set `paging_response_path` to `next` and Nango does the rest.


## Need help?
Something unclear or not working?

We are online in our [Community Slack](https://nango.dev/slack) and look forward to helping you debug and getting Nango to sync your data for you!