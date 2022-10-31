---
sidebar_label: 'Sync Reference'
sidebar_position: 10
---

# Sync Reference

## The `Nango.sync()` method

You can create a sync using Nango's native SDKs (or directly via the REST API). 

To create a sync using the native SDKs:
1. Make sure the API request works as expected (using Postman, a script, CLI etc.)
2. Call `Nango.sync(url, config)` using a `url` and a `config` object
3. Run your code once and make sure Nango syncs your data as expected

The `Nango.sync()` method will return the ID of the Sync object that was created. The Sync object is automatically saved in your local database for future configuration updates.


## The `config` object

| Field      | Data Type | Example Value | Description |
| ----------- | ----------- | ----------- | ----------- |
| `method` | string | `get` | The HTTP method of the external REST API endpoint (get, post, put, patch, delete). |
| `headers` | object | `{'Accept': 'application/json'}` | The headers that will be sent to the external API (e.g. auth header). |
| `body` | object | `{'limit': 10}` | The body parameters that will be sent to the external API (e.g. auth header). |
| `unique_key` | string | `id` | The key in the result objects used for deduping (e.g. email, id). |
| `response_path` | string | `profile.id` | The path to the result objects inside the external API response. |
| `paging_request_path` | string | `paging.after` | The paging cursor body parameter in the request to the external API. |
| `paging_response_path` | string | `paging.next.after` | The paging cursor path in the response from the external API. |
| `paging_url_path` | string | `paging.next.after` | The paging url path in the response from the external API. |
| `max_total` | string | 100 | The maximum total number of objects to fetch from the external API (across paginated calls). |

## Using the Nango API directly

The default URL to the Nango self-hosted API is http://localhost:3003/v1/syncs (POST).

The `config` object fields can be mapped to body parameters in the request to the Nango API.
