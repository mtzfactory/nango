---
sidebar_label: Initialize Nango
sidebar_position: 1
---

# Initialize Nango

As the first step of this [Tutorial](README.md) we will add Nango to your existing application.

## Prerequisites

You don't need much to get started with Nango, but please make sure the following is present:

- A recent version of `NPM` (>= 8.6.0) and `NodeJS` (>= 18.0.0) ([instructions](https://nangohq.notion.site/Prerequisites-Sample-Project-398e9314196b44cb8950132df15c8752) to check and install prerequisites)
- Docker (installation instructions [here](https://www.docker.com/products/docker-desktop/))
- A project to which you can add Nango (or you can use this [sample NodeJS project](https://nangohq.notion.site/Prerequisites-Sample-Project-398e9314196b44cb8950132df15c8752))


:::info
Nango is conceptually agnostic to your project's programming language and stack: it will work with any language and project.

That being said, Nango uses a client SDK to make interacting with it from your application super easy and native to your language and environment. We are working on adding client SDKs for all major programming languages (PHP, Ruby, Python and Java are all planned), but **currently we only offer a client for NodeJS projects**.
:::

## Initializing Nango in your project

To add Nango to your project, you need to fetch a `nango-integrations` folder in your repository. This is where all things Nango will live, such as the integrations that you build and their configuration.

Using the command line, navigate to the project where you want to add Nango. Then run this command:
```bash
npx nango init
```

This command

- installs the Nango CLI
- creates the `nango-integrations` folder in your project
- adds some scaffolding and default configuration to this folder

The `nango-integrations` folder will contain your integrations, including the Slack one that we are about to create as part of this tutorial. Feel free to explore this directory or learn more about the contents of `nango-integrations` [here](understand-nango/nango-integrations-folder.md).

Congrats, the first step is already done! Your project is now a Nango project and ready to run native integrations reliably.

Next we will set you up for local development of your integrations.