---
sidebar_label: Initialize Nango
sidebar_position: 1
---

# Initialize Nango

As the first step of this [Tutorial](README.md) we will add Nango to your existing application.

## Prerequisites

You don't need much to get started with Nango, but please make sure the following is present:

- A recent version of [nodeJS](https://nodejs.org/en/) and the NPM package manager, we recommend >18 for node and >8 for NPM
- [Docker](https://www.docker.com/)
- A project to which you can add Nango (this could also be a toy project or just an empty folder). If you need some inspiration, why not use this [sample project with nodeJS and TypeScript](https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript)


:::info
Nango is conceptually agnostic to your project's programming language and stack: This means it works with any language and project.

That being said, Nango uses a client SDK to make interacting with it from your application super easy and native to your language and environment. We are working on adding client SDKs for all major programming languages (PHP, Ruby, Python and Java are all planned), but currently we unfortunately only offer a client for NodeJS projects.
:::

## Initializing Nango in your project

You add Nango to your project by adding a `nango-integrations` folder in your repository. This is where all things Nango, such as the integrations that you build and their configuration, will live.

Using the commend line, navigate to the project where you want to add Nango. Inside your project, initialize the `nango-integrations` folder by running this command with the Nango CLI:
```bash
npx nango init
```

This command

- installs the Nango CLI
- creates the `nango-integrations` folder in your project
- adds some scaffolding and default configuration to this folder

The `nango-integrations` folder will contain your integrations, including the Slack one that we are about to create as part of this tutorial. Feel free to explore this directory or [learn more about the contents of `nango-integrations` here](understand-nango/nango-integrations-folder.md).

Congrats, the first step is already done! Your project is now a Nango project and ready to run native integrations reliably.

Next we will set you up for local development of your integrations.