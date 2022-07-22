---
sidebar_label: The nango-integrations folder
sidebar_position: 2
---

# The `nango-integrations` folder

Integrations and actions that you use with Nango as part of your product live inside a folder in your code base called `nango-integrations`.

The `nango-integrations` folder contains all the details, configuration and code of the integrations and actions that you defined in Nango. As such, it fully defines the behavior of Nango at runtime: You are guaranteed that a Nango server which loads your `nango-integrations` folder always behaves the same way, which makes deployments across different environments easy and painless.

Usually the `nango-integrations` folder lives in the root directory of your application which uses Nango for its native integrations, but you could place it anywhere in your code base where you see fit. In all cases we highly recommend that you version control it as part of the main repo of your application so it gets deployed together with the rest of your application (see also [deploying Nango](/build-integrations/deploy-nango.md)).

:::info
Nango can be used with any language or application framework, it is completely language agnostic.

However, because **actions** in Nango run inside the Nango runtime these currently **have to be written in TypeScript**. We go to great lengths to make sure that it is easy to write actions for Nango even if you are not an expert in TypeScript or JavaScript, all you need is basic knowledge of these languages.

You will find some references to the Node.js and JavaScript ecosystem on this page for those who are familiar with this ecosystem. If this is not you, don't worry: You will not have to be familiar with it to use Nango effectively and develop integrations or actions (we have step by step guides available for you with all the necessary commands).
:::

## Structure of `nango-integrations`

Every `nango-integrations` folder contains at least 3 files and should look like this:

![Overview diagram of a nango-integrations folder](/img/nango-integrations-folder.png)

If you are familiar with the JavaScript/Node ecosystem you might have recognized the `package.json` file: Indeed, your `nango-integrations` folder is just an npm package and acts like one in many ways. You can package your `nango-integrations` folder, version it, add additional dependencies from npm and publish it on any private (or public) npm registry such as the ones that are provided by GitHub and GitLab.

In practice this makes it easy to have your `nango-integrations` folder versioned along with your main application and deployed by version number in production or any other environment. This gives you fully reproducible builds and behavior across all environments. For more information on how to deploy to production or a staging environment please read our guide on [deploying Nango](/build-integrations/deploy-nango.md).

Now let's take a closer look of what is inside the `nango-integrations` folder:

The `slack` and `salesforce` folders contain the Actions of their respective integrations and we will get to them in a minute.

Besides the folder there are three top level files:

### `nango-config.yaml`
This YAML file contains all the global configuration for Nango. Many of these configuration parameters relate to how Nango executes actions, interacts with 3rd party APIs and treats response data: These configuration keys can usually be overwritten for specific Integrations by specifying them in the integration's `integrations.yaml` config.

For a list of all possible keys currently supported please check the [`nango-config.yaml` reference](/reference/config-reference.md#nangoConfigYaml).

### `integrations.yaml`
Contains the integration specific configuration for each integration. Because this file lists all the available integrations in your Nango installation it is also a good lookup place for that.

Configurations specified here generally take precedence over the defaults specified in `nango-config.yaml`, so you can overwrite defaults on a per integration level.

As an example let's look at the `integrations.yaml` configuration of a simple Slack integration:
```yaml
integrations:
  - slack:
      base_url: https://slack.com/api/
      call_auth:
        mode: AUTH_HEADER_TOKEN
      log_level: debug
```

Many keys here are optional, for all the details and possibilities please consult the [`integrations.yaml` reference](/reference/config-reference.md#integrationsYaml).

### `package.json`
This file makes `nango-integrations` an npm package, if you are familiar with npm packages and the `package.json` format you will find all the usual keys in here. If not don't worry: To use Nango you don't need to understand its content and we have guides with step by step commands for the few occasions where you do need to interact with it.

## Action files in Nango {#actionFiles}
The main components in the [Nango framework](framework-overview.md) are actions: Small pieces of code which form the bridge between your application and an external system.

Nango executes actions inside of the Nango runtime, you can think of this very similar to how a web framework gives you a structure around handling incoming HTTP requests.

### Where are actions stored
In the `nango-integrations` folder all actions of an Integration live:
- inside a sub-folder with the name of the integration in lowercase letters, for example our Slack integration's folder is called `slack`
- each action is in its separate file that follows the naming convention `<ACTION-NAME>.action.ts`.

In our example above we have
- `slack` folder which contains the actions
    - `notify` in `notify.action.ts`
    - `reply` in `reply.action.ts`
- `salesforce` folder which contains the actions
    - `import-contacts` in `import-contact.action.ts`
    - `update-contact` in `update-contact.action.ts`

To add a new action for an integration all you have to do is add a file to the corresponding subfolder with a file name that follows the naming scheme.

### Content of the action files
Actions are written in TypeScript and make use of a Nango provided runtime class. Because of this every action file has the same structure and follows this scaffold:

```typescript
import { NangoAction } from '@nangohq/action';

class SampleAction extends NangoAction {

  override async executeAction(input: any) {
    // Add your action code here
  }
}

export { SampleAction };
```
Nango will help you generate these scaffolds with our CLI.

## Optional content: `docker-compose.yaml` and `.env`

When you [initialize a new `nango-integrations` directory](/build-integrations/initialize-nango.md) with our CLI Nango adds two additional files by default:
- a `.env` file that specifies a single environment variable
- a `docker-compose.yaml` file which specifies a simple docker compose configuration

Whilst useful, these files are entirely optional and not used by Nango itself. You can delete them at any point if you want.

Together these files make it very easy to launch a local development environment directly from your `nango-integrations` folder. Just open a terminal, cd into the folder and run:
```bash
docker compose up  # or docker-compose up if you are on an older version of docker
```

To learn how to setup an awesome local development environment read our [tutorial on that topic](/build-integrations/setup-local-dev.md).