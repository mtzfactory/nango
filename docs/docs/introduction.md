---
slug: /
sidebar_position: 1
sidebar_label: Introduction
---

# Nango: The easiest way to sync data from external APIs

Nango continuously syncs data from any API endpoint to your local database and keeps it fresh for you.


## ⭐ Can you show me an example?

In your code you write:
```ts
nango.sync('https://api.hubspot.com/crm/v3/contacts', ...); // Syncs HubSpot contacts forever
```

Nango then takes care of:
- Pagination & full first sync
- Periodic refresh with incremental syncs
- Deduplication of records & upserts of changed data
- Detecting schema changes & alert you
- Automatic retries & rate-limit handling
- Making your syncs robust, so you never again have to worry about stuck/stale syncs or manual restarts

## 🧑‍💻 Cool, what can I build with it?

- Teams in SaaS companies use Nango to **build native in-app integrations** related to CRM contacts, payment transactions, HRIS employees, etc.
- Some **automate their personal lives** with Nango by syncing bank transactions or saved cooking recipes for further processing
- Nango can help you **quickly build proof of concepts** (which are easy to make production-grade) for hackathon projects, internal evaluations or to test the technical feasibility of your next big idea

## 🔍 Interesting, how can I try it?

**See Nango in Action**  
The fastest way to see Nango in action is with our [Quickstart 🚀](quickstart.md), head over there and sync data to your local machine in less than 3 minutes!

**Understand how Nango works**  
If you are ready to take a closer look we recommend you start with the [Architecture](architecture.md).

**See what you can build with Nango**  
You can also check out some [real-world examples](real-world-examples.md) of cool things you can build with Nango, or hop on our [Slack community](https://nango.dev/slack) to see what others are building with Nango.