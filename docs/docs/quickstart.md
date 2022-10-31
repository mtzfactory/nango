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

Run the CURL command bellow in the terminal:

```bash
  curl --request POST \
    --url http://localhost:3003/v1/syncs \
    --header "Content-type: application/json" \
    --data '{"url": "https://pokeapi.co/api/v2/pokemon", "response_path": "results", "paging_url_path":"next"}'
```

That's it! You have just created your 1st Sync :)

While CURL is great for testing, for production, you will probably prefer using one of our native SDKs to create syncs on the fly from your code: 

<Tabs groupId="programming-language">

  <TabItem value="node" label="Node SDK">

```js
import { Nango } from '@nangohq/node-client';

let config = {
    response_path: 'results',
    paging_url_path: 'next'
};

let res = await Nango.sync('https://pokeapi.co/api/v2/pokemon', config);

console.log(res.data);
```
  </TabItem>
</Tabs>


## Step 3: Inspect the synced data

The Sync you just created will keep your Pokémon list up-to-date forever (password is `nango`):
- View [the list of all Pokémons](http://localhost:8080/?pgsql=nango-db&username=nango&db=nango&ns=public&select=_nango_raw) in your local db
- View [the Sync's config](http://localhost:8080/?pgsql=nango-db&username=nango&db=nango&ns=public&select=_nango_syncs) in your local db


## Celebrate 🎉

Congratulations, you now have a local copy of all Pokémons in your database 🎉

Whilst this is just a small toy example we hope it has shown you how Nango can create powerful syncs with a single line of code.

Let's build cool things with Nango:
* [Explore the Architecture](architecture.md)
* [Join the Slack Community](https://nango.dev/slack)
* [Explore more examples](real-world-examples.md)
* [Contribute ❤️](contributing.md)

