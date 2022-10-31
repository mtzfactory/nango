---
sidebar_label: Architecture
sidebar_position: 3
---

# Architecture

[![Nango Architecture](/img/nango-architecture.png)](/img/nango-architecture.png)

## Overview of Nango
Nango runs as a [cloud service](nango-cloud.md) or a group of [self-hosted docker containers](nango-hosted.md).

The main way you interact with Nango from your application is the Nango SDK or REST API: With these APIs you can create new Syncs, query the status of Syncs, remove Syncs or (in the future) subscribe to updates from Syncs.

Once you added a Sync to Nango it takes care of all the annoying details for you to sync the data out to your local database:
- Nango performs full refreshes on first sync
- Nango performs periodic incremental refreshes
- Nango de-duplicates the data and upserts (update existing record or insert a new one) it for you into the existing table(s) as needed
- Nango monitors the sync jobs and automatically restarts jobs that are stuck, handles rate-limits etc.
- Nango alerts you if something goes wrong that requires your attention, e.g. major schema changes, unfixable authentication errors etc.

## Syncs: How Nango moves your data
**Syncs** are the main objects in Nango: **They represent a continuous job for Nango to pull data from an external API and sync it to your database**.

Here are some quick facts about Syncs:
- You [create Syncs](add-sync.md) from your application's code using the Nango SDK or the Nango REST API
- Syncs write the data they pull in directly to a database & table of your choosing
- You can have as many Syncs as you want
- You can think of Syncs as HTTP requests that are continuously run to get the latest data
    - This means every time you change something in the request parameters you should add it as a new Sync to Nango
    - The most common case for this are different authentication credentials (for different users)
- Syncs are smart and can deal with paginated data, authentication etc.
- You can manage your existing Syncs through the Nango SDK, REST API or our CLI (coming soon)

For a full list of a Syncs attributes and how to add one please check our [Adding a Sync](add-sync.md) guide.