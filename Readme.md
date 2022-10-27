<div align="center">
  
  ![Nango Logo](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/6311c3a48ebd85d6ed8f8f05_logo-background.png)

</div>

<h1 align="center">The best way to sync data from external APIs to your DB</h1>

<div align="center">
Nango continuously syncs data from any API endpoint to your local database and keeps it fresh for you.
</div>

<p align="center">
    <br />
    <a href="https://docs.nango.dev" rel="dofollow"><strong>Explore the docs »</strong></a>
    <br />

  <br/>
    <a href="https://docs.nango.dev">Examples</a>
    ·
    <a href="https://github.com/nangohq/nango/issues">Report Bug</a>
    ·
    <a href="https://nango.dev/slack">Community Slack</a>
</p>

## ⭐ Can you show me an example?

You do:
```ts
Nango.sync('https://api.hubspot.com/crm/v3/contacts', ...); // Start sync job for HubSpot contacts
```

We do:
* Pagination & full first sync
* Periodic refresh with incremential syncs
* Deduplication of records & upserts of changed data
* Detecting schema changes & alert you
* Automatic retries & rate-limit handling
* Making your syncs robust, so you never again have to worry about stuck/stale syncs or manual restarts


## 🧑‍💻 Cool, who uses it?
* Smart engineers in SaaS companies that build native CRM, payments or marketing integrations for their customers as part of their products
* Awesome weekend-warriors who automate their lifes by syncing bank transactions or saved recipes for further processing
* Sleep deprived hackathon hackers who want to focus on getting all the real-estate listings into a DB fast instead of building infra
* Chuck Norris.


## 🚀 Ok seriously, do you have a quickstart?

Let's setup a first sync job to pull in [a full list of pokemons](https://pokeapi.co/) (and keep it in sync, these bastards keep evolving!).

This uses our Node.JS SDK, but there is also REST API and support for other languages ([see docs](https://docs.nango.dev))

```ts
import Nango from '@nangohq/sync'

let job = await Nango.sync('https://pokeapi.co/api/v2/pokemon', // The endpoint we should sync data from
            'GET',                              // The HTTP request method to use
            {},                                 // Query parameters, e.g. {'q': 'pikachu'} -> ?q=pikachu
            {},                                 // The request body
            'results',                          // The key for the results
            'next',                             // The key for the pagination cursor
            'name'                              // The key that is unique per item in the results, usually an id
);

let dbConnectionString = job.getDbConnectionString();
let dbTableName = job.getDbTableName();

job.firstSyncFinished()                         // Resolves when the first full sync finishes
.then(() => {
    // Let's go fetch the imported data from the DB!
});
```


## 🔍 Awesome, tell me more!

⭐  Like Nango? Follow our development by starring us here on GitHub ⭐

-   Explore some [real world examples](https://docs.nango.dev)
-   Share feedback or ask questions on the [Slack community](https://nango.dev/slack)
-   [Chat with a member of the team](https://nango.dev/demo) 👋
-   Check our [blog on native integrations](https://www.nango.dev/blog)
