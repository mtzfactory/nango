---
sidebar_label: Configuration Reference
sidebar_position: 6
---

# Nango configuration reference

Here you can find every configuration parameter of Nango along with default values and a description of the behaviour.

## `nango-config.yaml` file (Global configuration & defaults) {#nangoConfigYaml}
Note that at this point all configuratin keys in this file are mandatory. The default value mentioned here refers to the default value with which Nango ships in a fresh installation.

| Key | Allowed Values | Default value | Description |
|---|---|---|---|
| main_server_log_level | See [supported log levels](#logLevels) below | `info` | The minimum log level of log messages emitted from the main Nango server code. This is pretty much everything inside of the Nango server except for the Actions code that runs inside the runtime |
| default_http_request_timeout_seconds | Any number >= 0. Putting 0 indicates no timeout. | 100 | The default timeout (in seconds) of HTTP requests sent as part of the execution of an Action in the Nango runtime. Can be overwritten per Integration with the `http_request_timeout_seconds` option |
| default_action_log_level | See [supported log levels](#logLevels) below | `info` | The minimum log level of log messages emitted from the execution of an Action in Nango. This applies to both user defined log messages, which are part of the Action code, as well as system defined log messages which indicate the start and end of the Action's execution. Can be overwritten per Integration with the `log_level` option |


## `integrations.yaml` file (Integrations configuration) {#integrationsYaml}
These configuration options are available per Integration, so this is a valid example of an `integrations.yaml`:
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

## Supported log levels {#logLevels}
Nango supports the following log levels (these are directly taken from [Winston](https://github.com/winstonjs/winston#logging-levels), the logging library used internally by Nango).

This list is sorted in descending order of importance, specifying a log level will also permit all levels above of it.

| level | description |
|---|---|
| error | Error messages: Something is broken or wrong, the operation could not be completed |
|  warn | Warnings: Something may break in the future or on a certain edge case but the operation could be completed |
| info | Information about the main operations happening |
| http | Detailed http request & response information is logged (currently not in use by Nango, may be removed in the near future -> use debug instead) |
| verbose | More detailed information, such as non-main operations, are logged (currently not in use by Nango, may be removed in the near future -> use debug instead) |
| debug | Detailed information that can be useful for debugging gets logged. Logs may get very large due to long output |
| silly | Don't be ridiculous |