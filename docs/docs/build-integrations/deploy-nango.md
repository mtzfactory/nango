---
sidebar_label: Deploying Nango
sidebar_position: 4
---

# Deploying Nango

:::caution
Nango is Alpha software and not ready for production.

We have included this section here to give you an overview of the deployment process and how it will work, but deploying the current version is at your own risk. If you want to deploy Nango to a server for staging or testing please reach out on our [community Slack](https://join.slack.com/t/nango-community/shared_invite/zt-1cvpdflmb-TMrjJJ_AZJeMivOgt906HA) and we will be glad to assist you!
:::

## Deployment process overview

Deploying Nango consists of three steps:
1. Deploying the Nango server container and its dependencies (more docker containers)
2. Packaging the `nango-integrations` folder and uploading it to a private npm registry
3. Configuring the Nango server to load the packaged `nango-integrations` from your npm registry

All three steps can easily be automated with a modern CI/CD pipeline and Nango will offer command line tools to help you even more.

If you don't already have a private npm registry somewhere [GitHub](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry) and [GitLab](https://docs.gitlab.com/ee/user/packages/npm_registry/) both offer a built-in option with all of their plans. Alternatively [npm itself also offers one](https://www.npmjs.com/products). We will publish detailed guides on using those.

## Components needed to run Nango in production

To run Nango at scale in production you will need at least:
- A way to run the nango-server docker container and scale it horizontally
- A rabbitMQ container (or at very large scale, a rabbitMQ cluster)
- Access to a postgres database
- A private npm registry (for hosted options see above, or host one yourself)

With regards to logs, by default Nango writes these to a log file at a path of your choosing but it can also be configured to pipe them into Sentry, Grafana/Prometheus, Datadog etc. Please reach out if you require this option.

## Nango Cloud?

Glad you asked.

Yes, we plan on offering a cloud hosted version of Nango which will take care of all the above mentioned production infrastructure. To deploy to the Nango cloud you also package your `nango-integrations` folder as described above and we will provide you with an npm registry to push it to. Your application can then specify the version of your `nango-integrations` folder to use when setting up the connection to Nango.

Logs can be piped to any of the tools mentioned above or you can inspect them in our web UI.

We have more unique cloud features planned, which unfortunately cannot be implemented in a self-hosted model. The core Nango framework and runtime will always be open source for sure though and we plan on always supporting a self-hosted version for the community and enterprise customers.

## Let's talk

If you have any questions about deploying Nango and using it in production or our cloud reach out: We would love to hear your feedback, thoughts and ideas. Just ping us in our community Slack's [#general channel](https://nango-community.slack.com/archives/C03QBHSMPUM) or directly message @robin or @bastien.