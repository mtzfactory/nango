---
sidebar_label: The nango-integrations folder
sidebar_position: 2
---

# The `nango-integrations` folder

Integrations and Actions that you use with Nango as part of your product live inside a folder in your code base called `nango-integrations`.

The `nango-integrations` folder contains all the details, configuration and code of the Integrations and Actions that you defined in Nango. As such, it fully defines the behaviour of Nango at runtime: You are guaranteed that a Nango server which loads your `nango-integrations` folder always behaves the same way, which makes deployments across different environments easy and painless.

Usually the `nango-integrations` folder lives in the root directory of your application which uses Nango for its native integrations, but you could place it anywhere in your code base where you see fit. In all cases we highly recommend that you version control it as part of the main repo of your application so it gets deployed together with the rest of your application (for production deployment see [[PROD DEPLOYMENT]]).

:::info
Nango can be used with any language or application framework, it is completely language agnostic.

However, because **Actions** in Nango run inside the Nango runtime these currently **have to be written in TypeScript**. We go to great lengths to make sure that it is easy to write Actions for Nango even if you are not an expert in TypScript or JavaScript, all you need is basic knowledge of these languages.

You will find some references to the Node.js and JavaScript ecosystem on this page for those who are familiar with this ecosystem. If this is not you, don't worry: You will not have to be familar with it to use Nango effectively and develop Integrations or Actions (we have step by step guides available for you with all the neccessary commands).
:::

## Structure of `nango-integrations`

Every `nango-integrations` folder contains at least 3 files and should look like this:

![Overview diagram of a nango-integrations folder](/img/nango-integrations-folder.png)

If you are familiar with the JavaScript/Node ecosystem you probably immediately recognized the `package.json` file: Indeed, your `nango-integrations` folder is just an npm package and acts like one in many ways: You can build your `nango-integrations` folder, version it and publish it on any private (or public) npm registry such as the ones that are provided by GitHub and GitLab.

In practice this makes it easy to have your `nango-integrations` folder versioned along with your main application and deployed by version number in production or any other environemnt. This gives you fully reprodrucible builds and behaviour across all environments. For more informaton on how to deploy to production or a staging environment please read our guide on [[DEPLOY TO PROD]].

Now let's take a closer look of what is inside the `nango-integrations` folder:

The `slack` and `salesforce` folders contain the Actions of their respective integrations and we will get to them in a minute.

For now let's take a closer look at the three top level files.

### `nango-config.yaml`