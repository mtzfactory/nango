
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Examples of Nango Sync

:::info Nango works with any API that returns JSON
The examples on this page are just a handful of the millions of APIs Nango supports out of the box, it is far from a complete list.

If you are unsure if your API is supported by Nango feel free to try it (we found that by now 80%+ of APIs work out of the box) or ask us on the [Slack community](https://nango.dev/slack): We are happy to help!
:::

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

This example syncs the stargazers of multiple different repos (and users) into a single table (we use `github_stargazers` here). It also adds metadata attributes, which get attached to every synced record. This metadata makes it easy to query e.g. all stargazers of repo X, user id Y or GitHub org Z.

**Nango Sync config to sync all stargazers from a repo to your local database:**
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
import { Nango } from '@nangohq/node-client'

let user_id = 1;        // Replace with your user id (can be any value)
let owner = 'nangohq';  // Replace with your github account
let repo = 'nango';     // Replace with your repo

let config = {
        mapped_table: 'github_stargazers',                 // Name of the destination table
        metadata: {                                        // Metadata that will get attached to every synced row
            user_id: user_id,                              // Our internal user id (or account id etc.)
            github_org: owner,                             // The GitHub org
            github_repo: repo                              // The repo name
        },
        unique_id: 'id',                                   // The key of the unique id in the records, for upserts

        headers: {                                         // HTTP headers to be sent with every API request
            'Accept': 'application/vnd.github+json'                    // GitHub recommends passing this for every API request
        },

        paging_header_link_rel: 'next'                     // For pagination.
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
"mapped_table": "github_stargazers",
"metadata": {
  "user_id": 1,
  "github_org": "NangoHQ",
  "github_repo": "nango"
},
"unique_id": 1,
"headers": {
  "Accept": "application/vnd.github+json"
},
"paging_header_link_rel": "next"
}'
  ```
  </TabItem>
</Tabs>

**Run the example ▶️**  
You can run this example from our [repo's examples directory](https://github.com/NangoHQ/nango/tree/main/examples) with:
```bash
npm run start syncGithubStargazers <owner> <repo> <user-id>
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
