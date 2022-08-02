---
sidebar_label: Logging
sidebar_position: 4
---

# Logging in Nango

Logging is a core part of Nango and built into the framework. There are 2 types of log messages:
- Log messages from the Nango server, e.g. when the execution of an Action starts or finishes, server health related messages or detected configuration changes
- Log messages from your own Action code when you call `this.logger.info` or `this.logger.debug` in your Action's code (cf. the [Actions reference](reference/actions.md#logger))

Currently both types of messages get logged to a single file called `nango-server.log` as well as to `stdout`.

## Setting log levels

Nango provides you with a lot of flexibility when you set your log levels:
- You can set a log level for all messages from the Nango server, see [reference](reference/configuration.md#nangoConfigYaml)
- You can set a default log level for all Integrations, see [reference](reference/configuration.md#nangoConfigYaml)
- You can override the default log level for a specific Integration by specifying it in your integrations.yaml, see [reference](reference/configuration.md#integrationsYaml)

We also have [a full list of the supported log levels](reference/logging.md) along with definitions of how they are used by Nango.

## Accessing the Nango logs

### Local development
The easiest way to observe the log messages is to look at the `stdout` of the terminal where you called `docker compose up`.
If you need to access the actual log file you can do so with this docker command:

```bash
docker exec -it nango-server sh
cd /usr/nango-server
```

Currently the log file is stored inside of the docker container, which also means that it gets deleted when you delete the container. In the future you will be able to choose its storage location.

### Self-hosted
As the log file is currently stored inside of the docker container please use the command mentioned above in "Local development" to access the logs. In the future you will be able to choose its storage location.

### Nango Cloud
[Nango Cloud](nango-cloud.md) will offer a graphical UI to access your log messages as well as the option to push logs to any (cloud) monitoring tool such as Sentry, Datadog etc.