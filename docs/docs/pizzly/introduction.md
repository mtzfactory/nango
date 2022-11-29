---
slug: '/pizzly/'
sidebar_label: Introduction
---

# Pizzly: The fast & flexible way to get OAuth tokens for 50+ APIs

Pizzly takes care of the OAuth dance for you and makes sure your access tokens always stay fresh.

## ⭐ Pizzly at a glance

Pizzly is a small, self-contained service (docker container) that contains everything you need to work with APIs that use OAuth.

Pizzly has been designed for modern web apps/backends and contains:

- a full OAuth 2 and OAuth 1.0a dance implementation for 50+ APIs (and more coming)
- a frontend SDK that makes it easy trigger new OAuth flows from your web app
- a backend SDK & REST API that make it easy to get always-fresh access tokens for your API calls
- a CLI that makes it easy to manage your OAuth provider configs, setup different environments and debug OAuth issues

Pizzly is easy to try in 5 minutes and can be deployed in 10.

Start a **new OAuth flow with 2 lines of code in your frontend**:

```ts
var pizzly = new Pizzly('https://localhost:3004')

// Trigger an OAuth flow for the user to authenticate with Slack
let result = await pizzly.auth('slack', '<user-id>')
```

Then **get and use the current access token in your backend** (with our SDK or a simple REST API):

```ts
var slackAccessToken = await pizzly.getAccessToken('slack', '<user-id>') // Always fresh & ready to use
```

## 👾 Out of the box support for 50+ APIs

More than 50 APIs are preconfigured to work out-of-the-box. Including:

- **Communication**: Gmail, Microsoft Teams, Slack, Zoom;
- **CRM**: Front, Hubspot, Salesforce, etc.
- **Developer tools**: GitHub, GitLab, BitBucket, Jira etc.
- **Accounting**: Xero, Sellsy, Zoho Books, etc.
- **Productivity**: Asana, Airtable, Google Drive, Google Calendar, Trello, Google sheets etc.
- **Social**: Twitter, LinkedIn, Reddit, Facebook etc.
- [and more...](https://github.com/NangoHQ/Pizzly/blob/master/packages/server/templates.yaml)

If your favorite API is missing [open a GitHub issue](https://github.com/NangoHQ/Pizzly/issues/new) or [contribute it right away](contribute-api.md): The API configurations are just simple [entries in a YAML file](https://github.com/NangoHQ/Pizzly/blob/master/packages/server/templates.yaml).

## 🛡️ Small, self-contained & ready for production

We built Pizzly because we wanted a simple and fast way to get (fresh) access tokens for any API that requires OAuth.

On purpose Pizzly is small, focused on its one task and easy to deploy in production:

- It runs as a single docker container in your stack
- Updating it is as simple as `docker pull` and restarting the container
- Securing it for production is quick & easy with only a minimal interface exposed publicly
- Our CLI helps you with all admin tasks (such as setting scopes, enabling APIs etc.)

Last but not least, Pizzly's active community continuously expands & updates the 50+ blueprints. So your OAuth flows & tokens will keep on working even 5 years down the road.

## 🚀 Get started with Pizzly

Pizzly can be added to your product in just 15-20 minutes with our [getting started](gettings=-started.md) guide.

Or explore more about Pizzly:
- For a first impression check out the [Quickstart](https://github.com/NangoHQ/Pizzly#quickstart) on our GitHub repo
- Explore [the full list of supported APIs](https://github.com/NangoHQ/Pizzly/blob/master/packages/server/templates.yaml)
- [Contribute a new API](contribute-api.md)
- Share feedback or ask questions on the [Slack community](https://nango.dev/slack)