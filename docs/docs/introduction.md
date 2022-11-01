---
slug: /
sidebar_position: 1
sidebar_label: Introduction
---

# Nango: The best way to sync data from external APIs

Nango continuously syncs data from any API endpoint to your local database and keeps it fresh for you.


## ⭐ How does it work?

You do:
```ts
Nango.sync('https://api.hubspot.com/crm/v3/contacts', ...); // Start sync job for HubSpot contacts
```

We do:
- Pagination & full first sync
- Periodic refresh with incremental syncs
- Deduplication of records & upserts of changed data
- Detecting schema changes & alert you
- Automatic retries & rate-limit handling
- Making your syncs robust, so you never again have to worry about stuck/stale syncs or manual restarts

## 🧑‍💻 Cool, who uses it?

-   Smart engineers in SaaS companies who build in-app integrations related to CRM contacts, payment transactions, HRIS employees, etc.
-   Awesome weekend-warriors who automate their lives by syncing bank transactions or saved cooking recipes for further processing
-   Sleep-deprived hackathon hackers who want to focus on getting all the real-estate listings into a DB fast instead of building infra
-   Chuck Norris.

## 🔍 Sounds good, how can I check it out?

The fastest way to see Nango in action is with our [Quickstart 🚀](quickstart.md), head over there and sync data to your local machine in less than 3 minutes!

You can also check out some [real-world examples](real-world-examples.md) of cool things you can build with Nango, or hop on our [Slack community](https://nango.dev/slack) to see what others are building with Nango.

## 🤔 Do you always talk like this?

Maybe 💁  
Skim through the docs and find out ;)