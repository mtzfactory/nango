<div align="center">
  
  ![Nango Logo](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/62aa0f9de9ebfd31d66f4ef7_Nango-logo-tight.png)

</div>

<h1 align="center">A single API for all CRM integrations</h1>

<div align="center">
Nango is an open source API that unlocks many CRM integrations at once. Close more deals, minimize engineering work.
</div>

<p align="center">
    <br />
    <a href="https://docs.nango.dev" rel="dofollow"><strong>Explore the docs »</strong></a>
    <br />

  <br/>
    <a href="https://docs.nango.dev/docs/supported-crms">Supported CRMs</a>
    ·
    <a href="https://docs.nango.dev/reference">Standard API Endpoints</a>
    ·
    <a href="https://github.com/nangohq/nango/issues">Report Bug</a>
    ·
    <a href="https://nango.dev/slack">Community Slack</a>
</p>

## ⭐ Why

Building CRM integrations one-by-one is slow and costly.

There are hundreds of CRMs out there with very different APIs. For each one, you need to understand their API reference, data modeling, developer approval process, authentication system, rate limiting, etc.

Most companies end up building the same infrastructure: scheduling, queueing, error handling, retries, authentication, logging, local development environment, CI/CD, etc.

Nango's goal is to make integration developers 10x more productive by providing them with a single CRM API, abstracting away all external CRM APIs and underlying integrations infrastructure.

## ✅ How It Works

1. Simply embed Nango's UI component to let users pick and authenticate to their favorite CRM.

<div align="center">
  
  ![How To - Image 1](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/6311bbe9fab5d2063576bc61_howto1.png)

</div>

2. Nango will periodically perform two-way syncs with all connected CRMs, abstracting away the various CRM APIs and complex infrastructure.

<div align="center">
  
  ![How To - Image 2](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/6311bbe956585b4cffb1756a_howto2.png)

</div>

3. You can query Nango's Standard API Endpoints and receive standard models. This way, you integrate once with a modern API to unlock many CRM integrations at once.

<div align="center">
  
  ![How To - Image 3](https://uploads-ssl.webflow.com/62a9f4a7a5a3d9ef1439982a/6311bbe90d09390ddaca9e80_howto3.png)

</div>

## 🚀 Quickstart

Let's fetch all contacts from any CRM system supported by Nango:

```
curl --request GET \
     --url 'https://api.nango.dev/v1/contacts' \
     --header 'Authorization: Bearer a6697f42-4b96-4138-9b2e-503b586e4b9d' \
     --header 'X-User-Account: 6b693b41-bf22-42e6-aa31-b75cd41749ab'
```

Explore our [Standard API Endpoints](https://docs.nango.dev/reference) to understand all the ways you can query the Nango API.

## 🔍 Learn more

⭐  Like Nango? Follow our development by starring us here on GitHub ⭐

-   Check out the list of [supported CRMs](https://docs.nango.dev/docs/supported-crms)
-   Explore Nango's [Standard API Endpoints](https://docs.nango.dev/reference)
-   Share feedback or ask questions on the [Slack community](https://nango.dev/slack)
-   [Chat with a member of the team](https://nango.dev/demo)
