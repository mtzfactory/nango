---
sidebar_label: 'Blueprints Overview'
sidebar_position: 1
---

# Blueprints Overview

Blueprints are pre-built integrations for standard use-cases. They are built and maintained both by Nango and the Nango community. Blueprints are optional, you can use them when they help you accelerate but they are not required to use Nango. In fact, they are just pre-built snippets using Nango to do things many people commonly do. Nango itself is fully integration agnostic and works with any API.

:::tip
Whilst blueprints are very helpful and speed up the development process of your integration they are **not required**: You can **use Nango with any API**, even if there is no blueprint available for it, and you will still get all of its builtin features like better logging, retries, rate-limit handling etc.
:::

## Blueprints for Integrations
A blueprint for an integration contains all the details Nango needs to work with that API out of the box. It contains:
- Configuration for the authentication (e.g. OAuth 2, OAuth 1.0a, API key etc.) flow
- Configuration for requests authorization (e.g. base API URL, default headers & query parameters etc.)
- Configuration for api wide concepts (e.g. rate-limit defaults, api wide errors & error handling, retry configuration etc.)
- Community contributed learnings & gotchas for the API on the blueprint's documentation page

Thanks to these you can expect Nango to handle all of these for you:
- OAuth authentication with our built-in OAuth server
- Per user access token storage & refresh as needed
- Automatic rate-limit detection & smart handling to maximize throughput
- Clean error handling of API errors

:::tip
**Missing a blueprint for your favorite API?**
You can either create one yourself and contribute it back to Nango by opening a pull request (we ❤️ community contributed blueprints). Or feel free to reach out to us on the [Slack community](https://nango.dev/slack) and we will be happy to add it to Nango for you!
:::

As Nango is open source you can find [all blueprints on our github repo](https://github.com/NangoHQ/nango/tree/main/blueprints). To contribute a new blueprint just add it to this directory and send us a pull request, thanks!

## Pre-built Actions

Action Blueprints cover standard use-cases (e.g. send a message on Slack). They can be used as is or as a base to extend. They are licensed under the same permissive license as Nango itself so you can use them without having to worry about licensing.

You can find some example actions in our own nango-integrations folder: https://github.com/NangoHQ/nango/tree/main/nango-integrations

:::info
The action blueprints are in progress. Whilst our Integration blueprints are ready for prime time the action Blueprints are mostly meant as examples for how to implement Actions. We plan on having many more Blueprints soon, as well as a thorough QA, documentation & contribution process for them.
:::