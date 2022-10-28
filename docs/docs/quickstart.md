---
sidebar_label: 'Quickstart 🚀'
sidebar_position: 2
---

# Quickstart

From page load to freshly synced Pokémons in your local DB in 3 minutes. Let's go!

## Prerequisites

Before we dive in make sure you have recent version of [Docker](https://www.docker.com/products/docker-desktop/) as well as [node.js](https://nodejs.org/en/) installed.

:::info Does Nango only work with Node.js projects?
No, Nango is programming language agnostic (it runs as a separate service in a docker container) and works with any language through its REST API.

We also have SDKs for PHP, Python, Ruby, Java and Node/Javascript to make working with Nango even easier.
:::

## Step 1: Download & run Nango

In a directory of your choice run:

```bash
git clone https://github.com/NangoHQ/nango.git
```

And then start Nango:
```bash
cd nango && docker compose up  # cd nango && docker-compose up if you are on an older version of docker
```

## Step 2: Add a sync job

In a new terminal, `cd` back into the folder where you cloned the nango repo and run this command:
```ts
node examples/quickstart.js
```

All this little script does is send a new sync request to Nango, which tells it to go and fetch all Pokémons [from the poke API](https://pokeapi.co/).

We are querying this endpoint to get the name and detail link of each Pokémon: `https://pokeapi.co/api/v2/pokemon`

## Step 3: Inspect the synced data


## Step 4: There is no step 4. Celebrate?
