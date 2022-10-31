---
sidebar_label: 'Quickstart 🚀'
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

From page load to freshly synced Pokémons in your local DB **in 3 minutes**. Let's go!

## Prerequisite

Before we dive in, make sure you have a recent version of [Docker](https://www.docker.com/products/docker-desktop/) installed.

## Step 1: Download & run Nango

In a directory of your choice run:

```bash
git clone https://github.com/NangoHQ/nango.git
```

And then start Nango:
```bash
cd nango && docker compose up  # cd nango && docker-compose up if you are on an older version of docker
```

## Step 2: Create a new Sync

Run the CURL request bellow in the terminal, or use one of our SDKs:

<Tabs groupId="programming-language">
  
  <TabItem value="curl" label="REST API (curl)">

  ```bash
  curl --request POST \
--url http://localhost:3003/v1/syncs \
 --header "Content-type: application/json" \
 --data '{"url": "https://pokeapi.co/api/v2/pokemon", "body": { "response_path": "results", "paging_url_path":"next"}}'
  ```
  </TabItem>

  <TabItem value="node" label="Node SDK">

```ts
import { Nango, NangoSyncConfig } from '@nangohq/node-client';

let config: NangoSyncConfig = {
    response_path: 'results',
    paging_url_path: 'next'
};

let res = await Nango.sync('https://pokeapi.co/api/v2/pokemon', config);

console.log(res.data);
```
  </TabItem>
</Tabs>

## Step 3: Inspect the synced data

You have just created your 1st Sync! It will keep your Pokémon list up-to-date forever:
- View [the list of all Pokémons](http://localhost:8080/?pgsql=nango-db&username=nango&db=nango&ns=public&select=_nango_raw) in your local db
- View [the Sync's config](http://localhost:8080/?pgsql=nango-db&username=nango&db=nango&ns=public&select=_nango_syncs) in your local db


## Step 4: There is no step 4. Celebrate?

Check out all the ways you can use and configure Nango in the rest of the docs.
