---
sidebar_label: Set up local development
sidebar_position: 2
---

# Set Nango up for local development

In this part of the tutorial we will set your Nango installation up for local development. This will allow you to develop smoothly without having to manually recompile and reload anything, whilst enjoying the same runtime environment that runs Nango integrations in production.

Let's do this!

First, `cd` into the `nango-integrations` folder you just setup in the last step:
```bash
cd nango-integrations
```

## Running the Nango server (aka the runtime)

Your nango-integrations includes a `docker-compose.yaml` by default. This makes it very easy to run a local development version of Nango on your machine which works exactly like the production environment.

Start the Nango server by running docker compose up:
```bash
docker compose up # or docker-compose up if you are on an older version of docker
```

Give it a few seconds and then you should see `✅ Nango Server is ready!` printed on your terminal.

The Nango server (sometimes also called the runtime) is where your integrations will run. It is a self-contained micro-service that provides the infrastructure to make native integrations easy and reliable: Automatic retries, rate-limit handling, detailed logging with no extra work from you and many other helpful abstractions are built into it.

When we write our Slack integration later on in this tutorial it will execute on the server and you will get to explore its outputs.

:::info
Starting the Nango server with docker compose from your local `nango-integrations` folder puts it into local development mode. In this mode it automatically monitors the `nango-integrations` folder for changes to your integrations and reloads them. So when you call your integrations in your application you can be sure that the server is using the latest version straight from your local `nango-integrations` directory.

This is different in production, where the server is running a pre-defined version of your integrations (that match the production version of your application). You can read more about [production deployment here](deploy-nango.md).
:::

## Installing `nango-integrations` dependencies

In a new terminal, navigate to that same `nango-integrations` folder inside your project.

The `nango-integrations` folder is configured as an [npm](https://docs.npmjs.com/packages-and-modules) package, which is why it contains a `package.json` file at its root. This has a few advantages:
- The package can be versioned for production deployments, which also makes it easy to do rollbacks if necessary
- You can easily use any existing npm package for writing your integrations
- You always have full control over which version of each dependency is used

By default our `nango-integrations` package only depends on a Nango runtime package. To install it just run:
```bash
npm install
```

## Set up the Typescript environment
Nango leverages the [typescript](https://www.typescriptlang.org/) programming language to write integrations. Unfortunately we cannot directly run Typescript on nodeJS but need to compile it to javascript. To keep development convenient we need to make sure that this compilation happens every time we modify a typescript file. 

The following command does just that for you:
```bash
tsc -w --project tsconfig.json
```

Recompiles happen on every file save and any compilation error will show up in the terminal window where you just ran `tsc -w --project tsconfig.json`.

:::caution
If your main project is a typescript project, you need to [exclude](https://www.typescriptlang.org/tsconfig#exclude) the `nango-integrations` folder in your `tsconfig.json` file. Since `nango-integrations` handles Typescript compilation independently (we need to make sure the compilation matches what the server expects), you do not want your main project to interfere with its compilation process.
:::

Congrats on setting up your development environment! You are ready to create your first integration from scratch. 