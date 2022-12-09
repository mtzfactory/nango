import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Core concepts

If you are new to Nango Sync please read this briefly: It will introduce all of the important concepts that help you get the most out of Sync fast.

[![Nango Sync Core concepts](/img/sync-core-concepts.png)](/img/sync-core-concepts.png)

## Syncs: How Nango moves your data
**Syncs** are the main objects in Nango: **They represent a continuous job for Nango to pull data from an external API and sync it to your database**.

They contain two important parts:
- Where and how to **fetch the data** from the external API
- Where and how to **transform and store the data** once it has been fetched

:::tip
You can think of Syncs as HTTP requests that Nango periodically runs for you to get the latest data.

Because they are "repeated" HTTP requests, you typically have 1 Sync per end user and endpoint from where you want to import data: The end user's authentication token is part of the HTTP request in the Sync's config.
:::

The fastest way to understand Syncs is with some quick facts:
- You [create Syncs](manage-syncs.md) (and manage them) from your application's code using the Nango SDK or the Nango REST API
- You can have as many Syncs as you want
- Syncs write the data they pull in continuously directly to a database & table of your choosing (more on this below)
- You can think of Syncs as HTTP requests that are continuously run to get the latest data
    - This means every time you change something in the request parameters, header or body you should add it as a new Sync to Nango
    - The most common case for this are different authentication credentials (for different users).
    - Most often you will have 1 Sync per user and API endpoint (e.g. you have 5 users all syncing data from endpoint X you would have 5 Syncs)
- Syncs automatically deal with paginated data, OAuth token refreshes etc. as needed


<!-- <details>
  <summary>If you want to see an example Sync now unfold me</summary>
  <div>
    Let's look at this example Sync, which syncs all stargazers of a GitHub repo to a table named `github_stargazers`:


  </div>
</details> -->

If you want to learn more about working with Syncs and the available options please check out [Creating & managing Syncs](managing-syncs.md).

## Storing & accessing synced data

Accessing data that Nango synced in is easy: Just read it from your postgres database.

Every record contains a timestamp when it was last updated, so fetching changes is also easy. Nango can tell your application every time a sync refresh (called a "sync job" in Nango) has finished and how many records have been inserted and updated.

To make accessing the data easier Nango also helps you with data transformation:
- Nango can transform the [JSON to a SQL schema](schema-mappings.md) for you
    - Optionally you can then also tell Nango to which table in the Postgres DB the schema & data should be written
- You can [attach Metadata](managing-syncs.md#sync-options) to every record Nango syncs in: For instance a user id, account id or any other data that is relevant for your application


This means that you can **tell Nango to write the data from many Syncs to the same postgres table**, so your application has only a single table it needs to query to e.g. fetch HubSpot contacts, GitHub repos, Google Calendar events etc. And thanks to the attached metadata it is easy to know which records belong to which user, company or anything else that matters to your application.

The easiest way to see this all is with a simple example.

## Full example of a common Nango setup

Let's assume we have a SaaS application where users can signup and import all the Stargazers of their GitHub repos, so we can let them filter them, show them in the UI etc.

Because the [GitHub API endpoint](https://docs.github.com/en/rest/activity/starring#list-stargazers) to fetch stargazers is per repo we will setup one Sync in Nango per user per GitHub repo.

In practice it looks like this:
<Tabs groupId="programming-language">
  <TabItem value="node" label="Node SDK">

```ts
async function addStargazersSync(owner, repo, user_id) {
    
    let config = {
        headers: {                                    // HTTP headers to be sent with every API request
            'Accept': 'application/vnd.github+json'   // GitHub recommends passing this for every API request
        },
        paging_header_link_rel: 'next'                // For pagination
        unique_id: 'id',                              // The key of the unique id in the records, for upserts

        mapped_table: 'github_stargazers',            // Name of the destination table
        metadata: {                                   // Metadata that will get attached to every synced row
            user_id: user_id,                         // Our internal user id (or account id etc.)
            github_org: owner,                        // The GitHub org
            github_repo: repo                         // The repo name
        },
    };

    new Nango().sync(`https://api.github.com/repos/${owner}/${repo}/stargazers`, nango_options); 
}

// Add a Sync each for the nango repo and the pizzly repo for the user with id 1
addStargazersSync('NangoHQ', 'nango', 1);
addStargazersSync('NangoHQ', 'pizzly', 1);
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

In our database Nango creates a single table called `github_stargazers`, which contains the data from both Syncs (much simplified here):
```plaintext
github_stargazers
┌────────────────────────────┬─────────┬─────────────┬─────────┬──────────────────────────────────┐
│         emitted_at         │ user_id │ github_repo │  login  │            avatar_url            │
├────────────────────────────┼─────────┼─────────────┼─────────┼──────────────────────────────────┤
│ 2022-12-07 14:01:52.019+00 │       1 │ nango       │ sradu   │ https://avatars.githubusercon... │
│ 2022-12-07 14:01:52.028+00 │       1 │ nango       │ bastien │ https://avatars.githubusercon... │
│ 2022-12-07 14:01:52.093+00 │       1 │ pizzly      │ sradu   │ https://avatars.githubusercon... │
└────────────────────────────┴─────────┴─────────────┴─────────┴──────────────────────────────────┘
```
Remember that Syncs are continuous, so Nango will automatically keep the data in this table up to date even as more people star the repos (or stars get removed).


In our application we can now run any SQL query we want to fetch the data and use it in our application:
```sql
-- Fetching all stargazers from all repos of user with id 1
SELECT * FROM github_stargazers WHERE user_id = 1;

-- Count the stargazers per repo for all repos of user with id 1
SELECT github_org, github_repo, COUNT(*)
FROM github_stargazers
WHERE user_id = '1'
GROUP BY github_org, github_repo;
```