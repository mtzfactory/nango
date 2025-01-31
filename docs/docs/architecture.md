# Architecture & Vision

[![Nango Architecture](/img/nango-architecture.png)](/img/nango-architecture.png)

## Overview of Nango
Nango runs as a cloud service or a group of self-hosted docker containers (see [deploying Nango to production](category/deploy-nango-open-source)).

The main way you interact with Nango from your application is the Nango SDK or REST API: With these APIs you can create new Syncs, query the status of Syncs, remove Syncs or (in the future) subscribe to updates from Syncs.

Once you added a Sync to Nango it takes care of all the annoying details for you to sync the data out to your local database:
- Nango performs full refreshes on first sync
- Nango performs periodic incremental refreshes
- Nango de-duplicates the data and upserts (update existing record or insert a new one) it for you into the existing table(s) as needed
- Nango monitors the sync jobs and automatically restarts jobs that are stuck, handles rate-limits etc.
- Nango alerts you if something goes wrong that requires your attention, e.g. major schema changes, unfixable authentication errors etc.

## Our vision: Fast & flexible integrations with 3rd party APIs
Nango exists because we believe it should be fast and easy for every software to integrate itself with 3rd party APIs - without any compromise on what you can with the API.

Today writing these integrations forces engineering teams to rebuild the same infrastructure over an over again: OAuth, pagination, retries, rate-limits, fair queues, change detection, upserts, schema mappings etc.
Many of the teams we talked to built internal frameworks to abstract these integrations away and avoid duplicate code.

With Nango our **aim is to provide the best tooling for engineers to work with 3rd party APIs**.  
All of our tools will follow the same philosophy:
- API agnostic (we will never have API specific parts in the core tools that would limit which APIs they work with)
- Focused (they solve one problem, but solve this well)
- Easy to compose (when you want to use them together they will be natural team players)
- Simple abstractions, powerful options (our tools are easy to reason about and get started, but offer endless possibilities for power users)

We want to enable you to build deep and powerful integrations with ease that make full use of the power of the external API.

Nango Sync is our first step towards this vision. But we will not stop here and look forward to expanding our palette of tools in the near future.