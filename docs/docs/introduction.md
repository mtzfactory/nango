---
slug: /
sidebar_position: 1
sidebar_label: Introduction
---

# Introduction

Nango provides open-source infrastructure for native integrations.

## Why?

Building native integrations is costly, particularly as you support more integrations, deeper integrations and higher traffic. Most companies end up building the same infrastructure: scheduling, queueing, error handling, retries, authentication, logging, local development environment, CI/CD, etc. Nango's goal is to make integration developers 10x more productive by providing them with this common infrastructure.

## A packaged micro-service for native integrations {#server}

Nango is an independent micro-service that centralizes interactions with external APIs. It can be run [locally](local-development.md), [self-hosted](nango-hosted.md) or managed by [Nango Cloud](nango-cloud.md). Nango runs your own integration-specific code, abstracting away the common infrastructure across integrations. It supports integrations of arbitrary complexity and scale, while remaining simple to use, reliable and extensible.

![Nango Server](/img/introduction.png)

Nango comes with bullet-proof infrastructure focused on native integrations:
- Queuing & scheduling
- Retries & error handling
- OAuth & token refresh
- Rate limit handling
- Logging & monitoring
- Delightful local development & testing
- CI/CD
- Many more features companies end up building from scratch!

## What is a native integration?

Native integrations designate the features in your product, for the benefit of your users, that are reliant on external services that your users also use. Native integrations are sometimes called "embedded", "customer-facing" or "product" integrations. Your product integrates to the external service via their public API. Users provide you with credentials to the 3rd-party service, usually via OAuth directly from your product. [Here](https://capsulecrm.com/integrations/) [are](https://linear.app/integrations) [example](https://reply.io/integrations) [pages](https://www.deel.com/integrations) advertising native integrations.

## FAQ

<details>
  <summary>Which APIs does Nango work with?</summary>
  <div>
    <div>Every API!</div>
    <br/>
    <div>
    Nango is fully API agnostic and works with every HTTP based API. Writing an Integration for an API with Nango is typically at least as fast a using a standard HTTP requests library.
    <br/>
    In addition Nango has 25+ Blueprints for commonly used APIs, with these you get OAuth, token refreshes, rate-limit handling and error handling just by adding a single line to your config file. We are expanding the Blueprints library every week. 
    </div>
  </div>
</details>