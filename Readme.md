<div align="center">
  
  ![Nango Logo](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/62aa0f9de9ebfd31d66f4ef7_Nango-logo-tight.png)

</div>

<h1 align="center">Open-source infrastructure for native integrations</h1>

<div align="center">
Native, customer-facing integrations for your B2B SaaS made simple, reliable and extensible.
</div>

<p align="center">
    <br />
    <a href="https://docs.nango.dev" rel="dofollow"><strong>Explore the docs »</strong></a>
    <br />

  <br/>
    <a href="https://docs.nango.dev/quickstart/node">Quickstart 🚀</a>
    ·
    <a href="https://github.com/nangohq/nango/issues">Report Bug</a>
    ·
    <a href="https://nango.dev/slack">Community Slack</a>
</p>

## ⭐ Why

Building native integrations is costly and time consuming, particularly as you support more integrations, deeper integrations and higher traffic. Most companies end up building the same infrastructure: scheduling, queueing, error handling, retries, authentication, logging, local development environment, CI/CD, etc. Nango's goal is to make integration developers 10x more productive by providing them with this common infrastructure.

## 🎁 A packaged micro-service for native integrations

Nango is an independent micro-service that centralizes interactions with external APIs. It can be run locally, self-hosted or managed by Nango Cloud. Nango runs your own integration-specific code, abstracting away the common infrastructure across integrations. It supports integrations of arbitrary complexity and scale, while remaining simple to use, reliable and extensible.

## ✅ Features

Nango comes with bullet-proof infrastructure focused on native integrations:

-   📁 A lightweight code framework to standardize integrations development
-   ⏱ Built-in infrastructure for scheduling, queuing and retries
-   🔒 Builtin OAuth support with automatic token refresh & UI components
-   🛠 Delightful local development to test integrations as you code
-   🔍 Powerful logging, monitoring and debugging
-   ❤️  Simple setup with a CLI and native SDKs
-   ⛔️ Automatic rate-limit detection & mitigation
-   👥 Community-contributed blueprints for common integration use-cases
-   🧩 Universal: Works with any API, any programming language & framework
-   💻  Self-hostable, single docker container for easy local development

Soon, we plan to support:

-   📺  Central dashboard with sync history, API errors, latency, live connections, etc.
-   🧠  Unified endpoints for multiple 3rd-party APIs & smart data transformation
-   🚨 Advanced alerting & monitoring, exportable to Datadog, Sentry, etc.
-   ☁️ Cloud-hosted edition

…and many more capabilities.

## 📘 Blueprints

Our [22+ Blueprints](https://docs.nango.dev/blueprint-catalog/blueprint-overview), such as [Intercom](https://docs.nango.dev/blueprint-catalog/blueprint-intercom), [Airtable](https://docs.nango.dev/blueprint-catalog/blueprint-airtable), [Asana](https://docs.nango.dev/blueprint-catalog/blueprint-asana), [Hubspot](https://docs.nango.dev/blueprint-catalog/blueprint-hubspot) or [Xero](https://docs.nango.dev/blueprint-catalog/blueprint-xero), help you kickstart your next integration.
Add two lines of code to your frontend & Nango config (see Quickstart) and you get:

-   Builtin & pre-configured OAuth flow (see Quickstart)
-   Builtin & pre-configured requests authorization
-   Automatic auth credentials handling & access token refresh
-   Automatic retries on timeouts
-   Automatic rate-limit handling
-   Full access to the API: Use any endpoint & raw requests/response
-   Community contributed gotchas & learnings which cover everything the API docs missed (add yours too!)

Nango also works with every other API, Blueprints are optional. We add more Blueprints every week.

## 🚀 Quickstart

Follow our [Quickstart guide](https://docs.nango.dev/quickstart/node) to **build a Slack integration from scratch in 10 minutes**!

With Nango, your integration code will look like this (Node.js example, [see other languages](https://docs.nango.dev/quickstart/other)):

```ts
import { Nango } from '@nangohq/node-client';

const nango = new Nango();

// Actions are defined by you and live in your repo as code
// For example: Post a message to a Slack channel
nango.triggerAction('slack', 'notify', userId, {
    channelId: 'XXXXXXX',
    msg: 'Hello @channel, this is a notification triggered by Nango :tada:'
});
```

And in your frontend, run a full OAuth flow with a single line of code (using Nango's builtin OAuth server):

```js
import Nango from '@nangohq/frontend';

var nango = new Nango('http://localhost:3003');

// Trigger an OAuth flow for 'slack' for the user with user-id 1
nango
    .connect('slack', '1')
    .then((result) => {
        console.log(`OAuth flow succeeded, integration has been setup for the user 🎉`);
    })
    .catch((error) => {
        console.error(`There was an error in the OAuth flow: ${error.error.type} - ${error.error.message}`);
    });
```

## 🔍 Learn more

⭐  Like Nango? Follow our development by starring us here on GitHub ⭐

-   Understand Nango with the [Architecture](https://docs.nango.dev/architecture)
-   Please share your feedback on the [Slack community](https://nango.dev/slack)!
