---
sidebar_label: Deploying to production
sidebar_position: 6
---

# Deploying Nango to production

Nango is currently in an Alpha stage with big developments every week: It will be production ready very soon, but currently we recommend you talk to us in the [Slack community](https://nango.dev/slack) (we are online there all day long) before deploying it in production.

We look forward to hearing from you!

## Self-hosted
Nango is very simple to self-host on a single machine with the `docker compose up` command. This command will automatically run a group of docker containers for you:
- Nango Server docker container
- Nango Worker docker container (1 or more)
- A rabbitMQ instance (for queuing)
- A postgres database to sync data to & store Syncs config (this will be separated in the future)

While we are in Alpha stage, please talk to us before using Nango for mission-critical and/or scaled production systems. We can help you make Nango more sturdy with some extra steps.

## Nango Cloud
If you want to benefit from super simple sync, at any scale, without the burden of self-hosting, Nango Cloud is for you: We run Nango in a production grade infrastructure for you (single tenant upon request) and you can focus on building great applications with the synchronized data.

Nango Cloud is currently under development but will be available soon, mark your interest on [this Github issue](https://github.com/NangoHQ/nango/issues/4) or ask about it in the [Slack community](https://nango.dev/slack).