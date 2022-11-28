---
sidebar_label: 'Real World Examples'
sidebar_position: 5
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Real world examples

A collection of cool things people have built with Nango.  
The sidebar to the right has an index so you can directly jump to your favorite 👉

* Want to run one of these? You can find these (and more) all ready to run in [the `/examples` folder in the repo](https://github.com/NangoHQ/nango/tree/main/examples)
* Need help with one of these (or another API/endpoint)? Reach out on our [Community Slack](https://nango.dev/slack), we are online all day and happy to help!
* Want to share yours? [Edit this file and submit a PR!](https://github.com/nangohq/nango/tree/main/docs/docs/real-world-examples.md)

## Reddit: Sync all posts/submissions from a subreddit

**Endpoint docs:**  
https://www.reddit.com/dev/api/#GET_new

**Nango Sync config to sync all submissions from a subreddit to your local database:**
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import { Nango } from '@nangohq/node-client'

let nango_options = {
    response_path: 'data.children',
    paging_cursor_object_response_path: 'data.name',
    paging_cursor_request_path: 'after',
    max_total: 100
};

new Nango().sync('https://www.reddit.com/r/${subreddit}/new.json', nango_options);  // Replace ${subreddit} with your subreddit
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```bash
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '
 {
"url": "https://www.reddit.com/r/${subreddit}/new.json",
"method": "GET",
"response_path": "data.children",
"paging_cursor_request_path": "after",
"paging_cursor_object_response_path": "paging.next.after"
}'
  ```
  </TabItem>
</Tabs>

**Run the example ▶️**  
You can run this example from our [repo's examples directory](https://github.com/NangoHQ/nango/tree/main/examples) with:
```bash
npm run start syncRedditSubredditPosts <subreddit>
```

## Slack: Sync all posts from a Slack channel

**Endpoint docs:**  
https://api.slack.com/methods/conversations.history

**Nango Sync config to sync all posts from a Slack channel to your local database:**
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import { Nango } from '@nangohq/node-client'

let nango_options = {
  response_path: 'messages',
  paging_cursor_metadata_response_path: 'response_metadata.next_cursor',
  paging_cursor_request_path: 'cursor',
  headers: {
      authorization: `Bearer ${app_token}`  // Replace with your Slack oauth_token
  },
  query_params: {
      channel: ${channel_id}  // Replace with the id of the channel you want to sync
  }
};

new Nango().sync('https://slack.com/api/conversations.history', nango_options); 
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```bash
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '
 {
"url": "https://slack.com/api/conversations.history",
"method": "GET",
"response_path": "messages",
"paging_cursor_request_path": "cursor",
"paging_cursor_metadata_response_path": "response_metadata.next_cursor"
}'
  ```
  </TabItem>
</Tabs>

**Run the example ▶️**  
You can run this example from our [repo's examples directory](https://github.com/NangoHQ/nango/tree/main/examples) with:
```bash
npm run start syncSlackMessages <oauth_token> <channel_id>
```

## Github: Sync all stargazers from a repo

**Endpoint docs:**  
https://docs.github.com/en/rest/activity/starring#list-stargazers

**Nango Sync config to sync all stargazers from a repo to your local database:**
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import { Nango } from '@nangohq/node-client'

let owner = 'nangohq';  // Replace with your github account
let repo = 'nango';     // Replace with your repo

let config = {
    headers: {
        authorization: `Bearer ${api_token}`  // Replace with your Github API token
    },
    paging_header_link_rel: 'next'
};

new Nango().sync('https://api.github.com/repos/${owner}/${repo}/stargazers', nango_options); 
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```bash
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '
 {
"url": "https://api.github.com/repos/nangohq/nango/stargazers",
"method": "GET",
"headers": {
  "authorization": "Bearer <api_token>"
},
"paging_header_link_rel": "next"
}'
  ```
  </TabItem>
</Tabs>

**Run the example ▶️**  
You can run this example from our [repo's examples directory](https://github.com/NangoHQ/nango/tree/main/examples) with:
```bash
npm run start syncGithubStargazers <api_token>
```


## HubSpot: Sync all HubSpot (CRM) contacts

**Endpoint docs:**  
https://developers.hubspot.com/docs/api/crm/contacts  
(click on the "Endpoints" tab, the use the dropdown to find the endpoint or scroll down)

**Nango Sync config to sync contacts from the HubSpot CRM to your local database:**
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import { Nango } from '@nangohq/node-client'

let nango_options = {
    headers: {
        'Authorization': 'Bearer YOUR_ACCESS_TOKEN'  // Replace with user's access token
    },
    response_path: 'results',
    unique_key: 'id',
    paging_cursor_request_path: 'after',
    paging_cursor_metadata_response_path: 'paging.next.after'
};

new Nango().sync('https://api.hubapi.com/crm/v3/objects/contacts?limit=10&archived=false', nango_options);
```
  </TabItem>
  <TabItem value="curl" label="REST API (curl)">

  ```bash
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '
 {
"url": "https://api.hubapi.com/crm/v3/objects/contacts?limit=10&archived=false",
"method": "GET",
"headers": { "Authorization": "Bearer YOUR_ACCESS_TOKEN"},
"response_path": "results",
"unique_key": "id",
"paging_cursor_request_path": "after",
"paging_cursor_metadata_response_path": "paging.next.after"
}'
  ```
  </TabItem>
</Tabs>

**Run the example ▶️**  
You can run this example from our [repo's examples directory](https://github.com/NangoHQ/nango/tree/main/examples) with:
```bash
npm run start syncHubspotContacts <oauth_token>
```
