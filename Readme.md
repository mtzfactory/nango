<div align="center">
  
  ![Nango Logo](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/6311c3a48ebd85d6ed8f8f05_logo-background.png)

</div>

<h1 align="center">The best way to sync data from external APIs</h1>

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
Nango.sync('https://api.hubspot.com/crm/v3/contacts', ...); // Starts syncing Hubspot's contacts forever!
```

We do:

-   Pagination & full first sync
-   Periodic refresh with incremental syncs
-   Deduplication of records & upserts of changed data
-   Detecting schema changes & alert you
-   Automatic retries & rate-limit handling
-   Making sure your sync is robust, so you never again have to worry about stuck/stale syncs or manual restarts

## 🧑‍💻 Cool, who uses it?

-   Smart engineers in SaaS companies who build in-app integrations related to CRM contacts, payment transactions, HRIS employees, etc.
-   Awesome weekend-warriors who automate their lives by syncing bank transactions or saved receipts for further processing
-   Sleep-deprived hackathon hackers who want to focus on getting all the real-estate listings into a DB fast instead of building infra
-   Chuck Norris.

## 🚀 Ok seriously, do you have a quickstart?

Let's setup your first Sync in 3 minutes. It will pull [the full list of pokémons](https://pokeapi.co/) (and keep it in sync, these bastards keep evolving!).

Clone the repo and start Nango locally...

```bash
git clone https://github.com/NangoHQ/nango.git
cd nango && docker compose up
```

...and create a Sync with a simple CURL!

```bash
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '{"url": "https://pokeapi.co/api/v2/pokemon", "body": { "response_path": "results", "paging_url_path":"next"}}'
```

That's all it takes! You can check out [the list of all Pokémons in your local database](http://localhost:8080/?pgsql=nango-db&username=nango&db=nango&ns=public&select=_nango_raw).

In practice, you probably want to use one of our native SDKs to interact with Nango's API ([see docs](https://docs.nango.dev)), e.g. for Node.JS:

```ts
import { Nango, NangoSyncConfig } from '@nangohq/node-client';

let config: NangoSyncConfig = {
    response_path: 'results', // The path to the Pokémons objects in the response.
    paging_url_path: 'next' // The path to the next page's url in the response.
};

await Nango.sync('https://pokeapi.co/api/v2/pokemon', config);
```

## 🔍 Awesome, tell me more!

⭐  Like Nango? Follow our development by starring us here on GitHub ⭐

-   Explore some [real world examples](https://docs.nango.dev)
-   Share feedback or ask questions on the [Slack community](https://nango.dev/slack)
-   [Chat with a member of the team](https://nango.dev/demo) 👋
-   Check our [blog on native integrations](https://www.nango.dev/blog)
