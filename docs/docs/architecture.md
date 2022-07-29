---
sidebar_label: Architecture
sidebar_position: 2
---

# Architecture

## Overview

Nango provides powerful infrastructure for developing native integrations. It focuses on dramatically improving both [local development](local-development.md) and runtime reliability of native integrations.

![Nango in production](/img/nango-architecture.png)

Nango consists of:
- The **Nango Server**, containerized with Docker, which runs your integrations and makes the external API calls. It can be run [locally](local-development.md), [self-hosted](nango-hosted.md) or managed by [Nango Cloud](nango-cloud.md).
- The **Nango Folder**, which contains your integration-specific code. At runtime this folder is deployed to the Nango Server to run your integrations.

Nango comes with bullet-proof infrastructure focused on native integrations described [here](introduction.md#server).

## Nango Integrations & Actions

Nango's flexible **Integrations** and **Actions** support arbitrary complex use-cases:

![Nango's Integrations and Actions](/img/integration.png)

- An **Integration** in Nango represents a connection between your product and an external system (e.g. Salesforce)
- An **Action** in Nango represents an individual workflow within the scope of an Integration (e.g. "Import all contacts" from Salesforce, "Log an email opened event" to Salesforce, etc.). Actions contain the business logic that is specific to each Integration. It can be customized at will and its code lives in the Nango Folder.

## Supported Stacks

Nango is agnostic to your programming language and technical stack. The Nango SDKs let you interact with the Nango Server from your app's codebase, natively in the programming language of your choice.

The Nango Folder itself supports Javascript/Typescript, but it is independent from the rest of your project and can live alongside any programming language you already use. 