---
slug: /
sidebar_position: 1
sidebar_label: Introduction
---

# Nango: The fast & flexible way to sync data from 3rd party APIs

Nango continuously syncs data from any API endpoint to your database and keeps it fresh for you.


## ⭐ Nango at a glance

Nango continuously syncs data from any API endpoint (that returns JSON) to your database.

Add Syncs to Nango with 1 line of code in your application:
```ts
Nango.sync('https://api.hubspot.com/crm/v3/contacts', ...); // Starts syncing contacts forever!
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

We have [more examples](https://docs.nango.dev/real-world-examples) of Nango configurations for different APIs and endpoints.

## 🔍 Try it & learn more

**See Nango in Action**  
The fastest way to see Nango in action is with our [Quickstart 🚀](quickstart.md), head over there and sync data to your local machine in less than 3 minutes.

**Understand how Nango works**  
If you are ready to take a closer look we recommend you start with the [Architecture](architecture.md).

**See what you can build with Nango**  
You can also check out some [real-world examples](real-world-examples.md) of things you can sync with Nango (keep in mind, it works with any API endpoint so these are just examples). Or join our [Slack community](https://nango.dev/slack) to see what others are building with Nango.