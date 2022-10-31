---
sidebar_label: Self-Hosted Edition
sidebar_position: 6
---

# Self-Hosted Edition

## Overview


Deploying Nango requires two simple steps that can easily be automated with a CI/CD pipeline:
1. Clone the Nango repository and run `docker compose up` on a VM
2. Publish the [Nango Folder](architecture.md) using the Nango CLI (via a private npm registry)

To keep the setup simple, we made some choices that are not yet optimal for production. For example the database is in the same machine as the server. We will mitigate this by the end of the [alpha](state-of-development.md) stage.

## Reach out

If you are interested or have questions/feedback about self-hosting Nango in production, reach out in our community Slack's [#general channel](https://nango-community.slack.com/archives/C03QBHSMPUM) or directly message @robin or @bastien.