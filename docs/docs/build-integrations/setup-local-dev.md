---
sidebar_label: Set up local development
sidebar_position: 2
---

`cd` to the `nango-integrations` folders.
```bash
cd nango-integrations
```

# Set up the Nango runtime

Start the Nango server docker container:
```bash
docker compose up # or docker-compose up
```

Give it a few seconds and then you should see `✅ Nango Server is ready!`

This command will fetch the Docker image and start the Docker containers for the Nango runtime.

You can see the the Nango runtime as an independent micro-service. It is the unified system that communicates with the 3rd-party APIs powering your integrations. In the context of this tutorial, the Nango runtime will initiate the HTTP requests to the Slack API.

:::info
Nango's runtime automatically loads the integrations from your `nango-integrations` folder contained in your project to power your native integrations.
:::

# Set up the Node environment

In a new terminal, navigate to the `nango-integrations` folder inside your project.

The `nango-integrations` is configured as an [npm](https://www.npmjs.com/) package. As such, it contains a `package.json` file at the root. 

Our `nango-integrations` package depends on other npm packages that we need to install. For this, just run:
```bash
npm install
```

# Set up the Typescript environment
Nango leverages the [typescript](https://www.typescriptlang.org/) programming language to write integrations. Because typescript compiles into javascript, we need to make sure that this compilation happens everytime we modify a typescript file. 

To do so, run the command:
```bash
npm run watch
```

From there on, every typescript file will be compile instead of a newly created `dist` directory inside the `nango-integrations` folder. Any compilation error will show in that terminal window where you ran `npm run watch`.

:::caution
If your main project is a typescript project, you need to exclude the `nango-integrations` folder inside your `tsconfig.json` file. Since `nango-integrations` compiles independently, you do not want your main project to interfer with its compilation process.
:::

Congrats on setting up your development environment! You are ready to create your first integration from scratch. 