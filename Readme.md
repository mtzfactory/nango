<div align="center">
  
  ![Nango Logo](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/6311c3a48ebd85d6ed8f8f05_logo-background.png)

</div>

<h1 align="center">The fast & flexible way to sync data from 3rd party APIs</h1>

<div align="center">
Nango continuously syncs data from any API endpoint to your database and keeps it fresh for you.
</div>

<p align="center">
    <br />
    <a href="https://docs.nango.dev" rel="dofollow"><strong>Explore the docs »</strong></a>
    <br />

  <br/>
    <a href="https://docs.nango.dev/real-world-examples">Examples</a>
    ·
    <a href="https://github.com/nangohq/nango/issues">Report Bug</a>
    ·
    <a href="https://nango.dev/slack">Community Slack</a>
</p>

## ⭐ Nango at a glance

Nango continuously syncs data from any API endpoint (that returns JSON) to your database.

Add Syncs to Nango with 1 line of code in your application:
```ts
new Nango().sync('https://api.hubspot.com/crm/v3/contacts', ...); // Syncs contacts forever!
```

Nango then takes care of:

-   Pagination & full first sync
-   Periodic refresh with incremental syncs
-   Deduplication of records & upserts of changed data
-   Automatic schema mapping from JSON to table/SQL schema
-   Detecting schema changes & alert you
-   Automatic retries & rate-limit handling
-   Making sure your sync is robust, so you never again have to worry about stuck/stale syncs or manual restarts

## 🧑‍💻 Example use cases
Nango is API agnostic: It works with any API endpoint that returns JSON (you just need to [give it a few details](https://docs.nango.dev/add-sync#sync-options) about the endpoint).

Whilst Nango supports millions of APIs, here are some of the most popular ones:
- **CRMs** such as [HubSpot](https://docs.nango.dev/real-world-examples#hubspot-sync-all-hubspot-crm-contacts), Salesforce, Pipedrive, Zoho CRM, Zendesk Sell etc.
- **Accounting systems** such as Quickbooks, Xero, Netsuite, Zoho Books, Freshbooks etc.
- **Cloud providers** such as AWS, GCP, Azure, DigitalOcean, Fly.io, Heroku etc.
- **Productivity tools** such as Gmail, Google Calendar, [Slack](https://docs.nango.dev/real-world-examples#slack-sync-all-posts-from-a-slack-channel), Outlook 365, Zoom, Google Drive etc.
- **Project Management tools** such as Airtable, Assana, Monday.com, ClickUp etc.
- **Devtools** such as [Github](https://docs.nango.dev/real-world-examples#github-sync-all-stargazers-from-a-repo), Gitlab, JIRA, Trello, Figma etc.
- ...any API endpoint that returns JSON

The docs have [more examples](https://docs.nango.dev/real-world-examples) of Nango configurations for different APIs and endpoints.

## 🚀 Quickstart

Let's setup your first Sync in 3 minutes!

It will pull [the full list of Pokémons](https://pokeapi.co/) to a local Postgres database (and keep it in sync, they love to evolve!).

Clone the repo and start Nango locally...

```bash
git clone https://github.com/NangoHQ/nango.git
cd nango && docker compose up
```

...and create a Sync with a simple CURL command:

```bash
curl --request POST \
    --url http://localhost:3003/v1/syncs \
    --header "Content-type: application/json" \
    --data '{"url": "https://pokeapi.co/api/v2/pokemon", "response_path": "results", "paging_url_path":"next"}'
```

That's it! You can check out [the list of all Pokémons in your local database](http://localhost:8080/?pgsql=nango-db&username=nango&db=nango&ns=nango&select=_nango_sync_1) (password is `nango`) as well as the [Sync logs](http://localhost:8011).

In practice, you probably want to use one of our native SDKs to interact with Nango's API ([see docs](https://docs.nango.dev)), e.g. for Node.JS:

```js
import { Nango } from '@nangohq/node-client';

let config = {
    response_path: 'results', // The path to the Pokémons objects in the response.
    paging_url_path: 'next' // The path to the next page's url in the response.
};

await new Nango().sync('https://pokeapi.co/api/v2/pokemon', config);
```

## 🔍 Learn more

⭐  Follow our development by starring us here on GitHub ⭐

-   Explore more [examples of syncing data from specific endpoints](https://docs.nango.dev)
-   Share feedback or ask questions on the [Slack community](https://nango.dev/slack)
-   Check out [Pizzly](https://github.com/NangoHQ/Pizzly), the fast & flexible way to get OAuth tokens for 50+ APIs
-   Check our [blog on native integrations](https://www.nango.dev/blog)

## 🔑 The 3rd party API needs OAuth to authenticate?
Nango has built-in support for OAuth through our sister project [Pizzly](https://github.com/NangoHQ/Pizzly), which makes it fast & flexible to get an OAuth token for any API.

If the API your are working with needs OAuth to connect and you have not implemented it yet we recommend you take a look at Pizzly: It handles all the OAuth flow & access token refresh for you, is easy to try and a small, self-contained container in production. 

Pizzly is integrated into Nango. If you use Pizzly for OAuth Nango will automatically have access to the latest access token and use it for its syncs.
