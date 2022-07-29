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

Building native integrations is costly, particularly as you support more integrations, deeper integrations and higher traffic. Most companies end up building the same infrastructure: scheduling, queueing, error handling, retries, authentication, logging, local development environment, CI/CD, etc. Nango's goal is to make integration developers 10x more productive by providing them with this common infrastructure.

## 🎁 A packaged micro-service for native integrations

Nango is an independent micro-service that centralizes interactions with external APIs. It can be run locally, self-hosted or managed by Nango Cloud. Nango runs your own integration-specific code, abstracting away the common infrastructure across integrations. It supports integrations of arbitrary complexity and scale, while remaining simple to use, reliable and extensible.

## ✅ Features

Nango comes with bullet-proof infrastructure focused on native integrations:

-   📁 A lightweight code framework to standardize integrations development
-   ⏱ Built-in infrastructure for scheduling, queuing and retries
-   🔒 OAuth support with UI components for authenticating end-users + token refresh
-   🛠 Delightful local development to test integrations as you code
-   🔍 Powerful logging, monitoring and debugging
-   ❤️  Simple setup with a CLI and native SDKs
-   ⛔️ Fine-grained rate-limit configuration
-   👥 Community-contributed blueprints for common integration use-cases
-   🧩 Universal: Works with any programming language & framework
-   💻  Self-hostable, single docker container for easy local development

Soon, we plan to support:

-   📺  Central dashboard with sync history, API errors, latency, live connections, etc.
-   🧠  Unified endpoints for multiple 3rd-party APIs & smart data transformation
-   🚨 Advanced alerting & monitoring, exportable to Datadog, Sentry, etc.
-   ☁️ Cloud-hosted edition

…and many more capabilities.

## 🚀 Quickstart

Follow our [Quickstart guide](https://docs.nango.dev/quickstart/node) to **build a Slack integration from scratch**!

With Nango, your integration code will look like this (node.JS example, [see other languages](https://docs.nango.dev/quickstart/other)):

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

-   Understand Nango with the [Architecture](https://docs.nango.dev/architecture)
-   Please share your feedback on the [Slack community](https://nango.dev/slack)!
