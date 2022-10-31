---
sidebar_label: Deploying to production
sidebar_position: 6
---

# Deploying Nango to production

Nango is currently in an alpha state with big developments every week: It will be production ready very soon, but currently we recommend you talk to us in the [Slack community](https://nango.dev/slack) before deploying it in production.

We look forward to hearing from you!

## Self-hosted
Nango can be self-hosted as a group of docker containers. Currently the minimal setup looks something like this:
- Nango Server docker container
- Nango Worker docker container (1 or more)
- A rabbitMQ instance (for the queue)
- Access to a postgres database to sync data to & store syncs config (this will be separated in the future)

We aim to make it easy to run Nango yourself in your own cloud environment, but please keep in mind that because the problem we are solving has a lot of moving parts (literally) there will always be some complexity associated with self-hosting.

## Nango Cloud
If you want to benefit from super simple syncs without the hassle of self-hosting Nango Cloud is for you: We run Nango in a production grade infrastructure for you (single tenant upon request) and you can focus on building great applications with the synchronized data.

Nango cloud is currently under development but will be available soon, mark your interest on [this github issue](https://github.com/NangoHQ/nango/issues/4) or ask about it in the [Slack community](https://nango.dev/slack).