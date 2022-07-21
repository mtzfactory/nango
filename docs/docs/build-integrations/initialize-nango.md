---
sidebar_label: Initialize Nango
sidebar_position: 1
---

:::caution
Nango is conceptually agnostic to your project's programming language and stack. We plan to have Nango client SDKs for all major languages in the near future. For the time being, this tutorial assumes that you are integrating Nango to a NodeJS project. 
:::

:::tip
If you do not have a existing NodeJS project, you can create a new one with this [tutorial](https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript).
:::

Using the commend line, navigate to the project for which you want to add an integration. Inside your project, initialize the `nango-integrations` repository.
```bash
npx nango init
```

This command installs the Nango CLI and creates the `nango-integrations` folder with the right scaffolding and configuration. The `nango-integrations` folder will contain your integrations, including the Slack one that we are about to create. Feel free to explore this directory or [learn more about it here](understand-nango/nango-integrations-folder.md).