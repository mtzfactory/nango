<div align="center">
  
  ![Nango Logo](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/62aa0f9de9ebfd31d66f4ef7_Nango-logo-tight.png)

</div>

<h1 align="center">The native integrations framework</h1>

<div align="center">
Native, customer-facing integrations for your B2B SaaS made simple, reliable and extensible.
</div>

<p align="center">
    <br />
    <a href="https://docs.nango.dev" rel="dofollow"><strong>Explore the docs »</strong></a>
    <br />

  <br/>
    <a href="https://docs.nango.dev/quickstart">Quickstart 🚀</a>
    ·
    <a href="https://github.com/nangohq/nango/issues">Report Bug</a>
    ·
    <a href="https://nango.dev/slack">Community Slack</a>
</p>

## ⭐ Why

Building native integrations becomes harder as you support more integrations, deeper integrations and higher traffic.

Most teams today are building native integrations in their main application code, with or without an internal framework, and quickly face serious issues regarding:

-   Scheduling, queuing and retries
-   Error handling, logging & debugging
-   Local development & testing
-   Data modeling & merging different schemas
-   Authentication & rate limiting
-   3rd party API limitations: missing docs, down-time, migrations, etc.

Our team built dozens of integrations, spent hundreds of hours on maintenance, and we have had enough! It’s time to 10x the productivity of any developer building native integrations.

This is why we built Nango, an open-source framework built on 3 core principles:

-   **Simplicity:** A simple yet powerful abstraction that makes common use cases easy and the difficult ones possible
-   **Reliability:** Robust in every way, no matter how many integrations and traffic you throw at it
-   **Extensibility:** Nango will never stand in your way to build deep, native integrations with unlimited customization

## ✅ Features

Nango is a full-featured framework that provides an end-to-end solution for native integrations:

-   📁  A lightweight code framework to standardize integrations development
-   ⏱ Builtin infrastructure for scheduling, queuing and retries
-   🛠  Local development environment to test integrations and iterate faster
-   🔍 Powerful logging and debugging
-   ❤️  Simple setup with a CLI and native SDKs
-   ⛔️ Fine-grained rate-limit configuration
-   🧩 Universal: Works with any programming language & framework, e.g. nodeJS, Ruby, Python, PHP, Java etc.
-   💻  Self-hostable, single docker container for easy local development

Soon, we plan to support:

-   👥  Community-contributed blueprints for common integration use-cases
-   🔒  OAuth support with (optional) UI components for authenticating end-users
-   📺  Central dashboard with sync history, API errors, latency, live connections, etc.
-   🧠  Unified endpoints for multiple 3rd-party APIs & smart data transformation
-   🚨 Advanced alerting & monitoring, exportable to Datadog, Sentry, etc.
-   ☁️ Cloud-hosted edition

…and many more capabilities.

## 🚀 Quickstart

Follow our [Quickstart guide](https://docs.nango.dev/quickstart) to **build a Slack integration is 30 seconds**!

With Nango, your integration code will look like this (nodeJS example, Nango also works with Python, PHP, Ruby, Java etc.):

```ts
import { Nango } from '@nangohq/node-client';

const nango = new Nango();

nango.registerConnection('slack', userId, oAuthToken);

// Post a message to a Slack channel
nango.triggerAction('slack', 'notify', userId, {
    channelId: 'XXXXXXX',
    msg: 'Hello @channel, this is a notification triggered by Nango :tada:'
});
```

## 🔍 Learn more

⭐  Like Nango? Follow our development by starring us here on GitHub ⭐

-   Create an integration from scratch with our step-by-step [step-by-step tutorial](https://docs.nango.dev/build-integrations/)
-   Understand Nango with the [Framework Overview](https://docs.nango.dev/architecture)
-   Please share your feedback on the [Slack community](https://nango.dev/slack)!
