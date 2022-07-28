---
sidebar_label: Configuration
sidebar_position: 1
---

# Configuration

Here you can find every configuration parameter of Nango along with default values and a description of the behavior.

## `nango-config.yaml` {#nangoConfigYaml}

This files contains the global configuration of Nango.

Note that all configuration keys in this file are mandatory at this point. The default values mentioned here refer to values shipping with a new Nango initialization.

| Key | Allowed Values | Default value | Description |
|---|---|---|---|
| main_server_log_level | See [supported log levels](#logLevels) below | `info` | The minimum log level of log messages emitted from the main Nango server code. This is pretty much everything inside of the Nango server except for the Actions code that runs inside the runtime |
| default_http_request_timeout_seconds | Any number >= 0. Putting 0 indicates no timeout. | 100 | The default timeout (in seconds) of HTTP requests sent as part of the execution of an Action in the Nango runtime. Can be overwritten per Integration with the `http_request_timeout_seconds` option |
| default_action_log_level | See [supported log levels](#logLevels) below | `info` | The minimum log level of log messages emitted from the execution of an Action in Nango. This applies to both user defined log messages, which are part of the Action code, as well as system defined log messages which indicate the start and end of the Action's execution. Can be overwritten per Integration with the `log_level` option |


## `integrations.yaml` {#integrationsYaml}

This file contains integration-specific configuration. Here is an example:
```yaml
integrations:
    - slack:
        base_url: 'https://slack.com/api',
        action_log_level: debug
    - salesforce:
        base_url: 'https://api.salesforce.com',
        action_log_level: error
```

| Key | Allowed Values | Key mandatory? | Default value | Description |
|---|---|---|---|---|
| base_url | Any URL starting with `https://` or `http://` | Yes | __n/a, must be supplied by the user__ | The base URL which will be prepended on any http request made from Actions in this Integration. See [[ACTION DOCU]] for details |
| call_auth -> mode | Currently only `AUTH_HEADER_TOKEN` is supported | Yes | `AUTH_HEADER_TOKEN` | How authorization works for the API, `AUTH_HEADER_TOKEN` means Nango will add an `Authorization: Beaer XXXXXXXXX` header |
| log_level | See [supported log levels](#logLevels) below | No | Falls back to `default_action_log_level` if not supplied | The minimum log level of log messages emitted from the execution of an Action from this Integration in Nango. This applies to both user defined log messages, which are part of the Action code, as well as system defined log messages which indicate the start and end of the Action's execution. |
| http_request_timeout_seconds | Any number >= 0. Putting 0 indicates no timeout. | No | Falls back to `default_http_request_timeout_seconds` if not supplied | The default timeout (in seconds) of HTTP requests sent as part of the execution of an Action in the Nango runtime. |
