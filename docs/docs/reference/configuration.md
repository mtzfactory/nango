---
sidebar_label: Configuration
sidebar_position: 1
---

# Configuration

Here you can find every configuration parameter of Nango along with default values and a description of the behavior.

## `nango-config.yaml` - Nango Server config {#nangoConfigYaml}

This files contains the configuration of the Nango server.

Note that all configuration keys in this file are mandatory at this point. The default values mentioned here refer to values shipping with a new Nango initialization.

### main_server_log_level
_Default: info_

The minimum log level of log messages emitted from the main Nango server code. This is pretty much everything inside of the Nango server, including the builtin OAuth server, except for the Actions code that runs inside the runtime.

See [logging reference](reference/logging.md) for a full list of available log Levels and their definition.


### default_http_request_timeout_seconds {#nangoConfig-default_http_request_timeout_seconds}
_Default: 100_

Allowed values: Any number >= 0. Putting 0 indicates no timeout.

The default timeout (in seconds) of HTTP requests sent as part of the execution of an Action in the Nango runtime. Can be overwritten per Integration with the `http_request_timeout_seconds` option of the Integration config.

### default_action_log_level {#nangoConfig-default_action_log_level}
_Default: info_

The minimum log level of log messages emitted from the execution of an Action in Nango. This applies to both user defined log messages, which are part of the Action code, as well as system defined log messages which indicate the start and end of the Action's execution. Can be overwritten per Integration with the `log_level` option of the Integration config.

See [logging reference](reference/logging.md) for a full list of available log Levels and their definition.

### oauth_server_enabled
_Default: true_

Determines whether the builtin OAuth server gets started when the Nango server starts. Set to `false` to disable the OAuth server, though using the builtin OAuth server for OAuth is strongly recommended.

### oauth_server_port
_Default: 3003_

The port where the builtin OAuth server listens. Note that if you change this value you will likely also need to change the docker container configuration in `docker-compose.yaml`!

### oauth_server_root_url {#nangoConfig-oauth_server_root_url}
_Default: http://localhost:3003_

The root URL where the builtin OAuth server can be reached from the Internet (or local machine in the case of a local development setup). This URL is used to create the OAuth callback URL that will have to be registered with the OAuth providers. The OAuth server prints the full callback URL for the current configuration on startup with the `info` log level.

:::note
**HTTPS based callback URLs & local development**

Some OAuth providers insist on an `https://` based callback URL. Setting up HTTPS locally is rather annoying and tricky, we recommend that you use a forwarding service like [ngrok](https://ngrok.com/) which provides you with an `https` callback URL that forwards to your localhost.

If you use the default Nango OAuth server port this one-liner will do the trick:
```bash
ngrok http 3003
```

Then copy the URL you get under `Forwarding` and add it as `oauth_server_root_url` in your nango-config.yaml.
:::


## `integrations.yaml` - Integration config {#integrationsYaml}

This file contains all the integration-specific configuration. Here is an example:
```yaml
integrations:

    # This is what almost all integrations will look like in your file
    slack:
        extends_blueprint: slack:v0
        log_level: debug

        oauth_client_id: <YOUR SLACK CLIENT ID>
        oauth_client_secret: ${SLACK_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need

    # An example integration which lists every parameter possible for an OAuth2 integration.
    # In reality you will never encounter this
    example:
        log_level: info
        http_request_timeout_seconds: 60

        app_api_key: ${EXAMPLE_APP_API_KEY}

        oauth_client_id: <YOUR EXAMPLE CLIENT ID>
        oauth_client_secret: ${EXAMPLE_CLIENT_SECRET}
        oauth_scopes:
            - the scopes
            - you need

        auth:
            auth_mode: OAUTH2
            authorization_url: https://oauth.example.com/authorize
            authorization_params:
                access_type: offline

            scope_separator: ' '

            token_url: https://oauth.example.com/token
            token_params:
                grant_type: authorization_code

            authorization_method: header
            body_format: form

            refresh_url: https://oauth.example.com/tokenRefresh

        requests:
            base_url: 'https://api.example.com/v1/'

            headers:
                User-Agent: Nango
                Authorization: Bearer ${access_token}

            params:
                api_key: ${app_api_key}
```
### Environment variable placeholders {#integrationsConfig-env_vars}
Nango offers environment variable substitution across all values in the `integrations.yaml` file. Nango will automatically make every environment variable `ENV_VAR` available with the placeholder `${ENV_VAR}`.

This is especially helpful for secrets like [oauth_client_secret](#integrationsConfig-oauth_client_secret) but could also be used to supply different values for other keys depending on the environment where Nango runs.

The substitution happens when the nango server starts, so you need to make sure the appropriate environment variables are set for the server docker container (for instance by adding them to the default `.env` file).

### extends_blueprint
_Default: Optional, if not specified a full `auth` and `requests` object is expected instead_

Specifies the [Blueprint](blueprint-catalog/blueprint-overview.md) from which this Integration should inherit. The format of the value is `blueprintName:version`. The blueprint name must match 1:1 with a blueprint in the [Nango Blueprints folder](https://github.com/NangoHQ/nango/tree/main/blueprints). The version part is optional, if it is not specified the latest version of the Blueprint will be use. Because Blueprints may get new versions over time when new versions of the API becomes available it is strongly recommended that you always manually specify the Blueprint version which should be extended. This ensures that your existing code continues to work until you are ready to upgrade to the new version.

Because Blueprints specify the `auth` and `requests` part for you using this parameter is strongly encouraged whenever a Blueprint is available for the API you want to integrate. If no Blueprint is available you can contribute one and save future users a lot of hassle. Thank you!


### Overwriting parameters from the blueprint
In rare cases you might want to overwrite a parameter in your integration configuration which has been set by the blueprint you are extending. You can easily do this for any parameter, values that are specified directly in the Integration's configuration overwrite any values set by the blueprint.

Here is an example which overrides the `requests` -> `base_url` parameter from the [Slack blueprint](blueprint-catalog/blueprint-slack.md) to change the base API URL:
```yaml
    #... other integrations
    slack:
        extends_blueprint: slack:v0

        # Overwrite requests -> base_url, which is already set by the blueprint
        requests:
            base_url: https://fakeapi.slack.com/
```

### log_level
_Default: Optional parameter, if not specified the value is inherited from [`default_action_log_level`](#nangoConfig-default_action_log_level)_

The minimum log level of log messages emitted from the execution of an Action from this Integration in Nango. This applies to both user defined log messages, which are part of the Action code, as well as system defined log messages which indicate the start and end of the Action's execution.

See [logging reference](reference/logging.md) for a full list of available log Levels and their definition.

### http_request_timeout_seconds
_Default: Optional parameter, if not specified the value is inherited from [`default_http_request_timeout_seconds`](#nangoConfig-default_http_request_timeout_seconds)_

Allowed value: Any number >= 0. Putting 0 indicates no timeout.

The timeout (in seconds) of HTTP requests sent as part of the execution of an Action which belongs to this Integration.

### app_api_key
_Default: Optional parameter, if not specified the value is `undefined`_

Integration wide API key of your application. Some APIs require consumers to pass in an application specific api key, see the above snippet for example usage. The `${app_api_key}` placeholder can be used in any value in `requests -> headers` or `requests -> params`.

### oauth_client_id
_Default: Mandatory if the `auth_mode` is set to `OAUTH2` or `OAUTH1`. Otherwise optional/not used_

The OAuth client id of your application for this Integration. You will get this from the OAuth provider/external API when you register your application there.

### oauth_client_secret {#integrationsConfig-oauth_client_secret}
_Default: Mandatory if the `auth_mode` is set to `OAUTH2` or `OAUTH1`. Otherwise optional/not used_

The OAuth client secret of your application for this Integration. You will get this from the OAuth provider/external API when you register your application there.

**You should treat this secret like a password** and never commit it to your source code repository. To make this possible Nango offers [environment variable substitution](#integrationsConfig-env_vars) in the `integrations.yaml` file. Typically the value will then read `${EXAMPLE_OAUTH_CLIENT_SECRET}`.

### oauth_scopes
_Default: Mandatory if the `auth_mode` is set to `OAUTH2` or `OAUTH1`. Otherwise optional/not used_

An array of scopes which you would like to request authorization for. The values allowed here vary from API to API, you can find the options in the documentation of the API which you are integrating. Sometimes our [Blueprints](blueprint-catalog/blueprint-overview.md) will list these for you.

The value in this array will be joined together into a string by using the [scope_separator](#integrationsConfig-auth_scope_separator).

### auth -> auth_mode {#integrationsConfig-auth_auth_mode}
_Default: Mandatory, can be any value of `OAUTH2`, `OAUTH1`, `API_KEY` or `USERNAME_PASSWORD`_

The authorization mode to be use for this Integration. This affects both how user Connections can be registered with Nango as well as how authorization data is added to each request. Please read the [auth guide](guides/auth.md) for details on how this parameter influences various functions of Nango.

### auth -> authorization_url
_Default: Mandatory if the `auth_mode` is set to `OAUTH2` or `OAUTH1`. Otherwise optional/not used_

The URL where the user is redirected to for authorization of your application. You will find this URL in the OAuth documentation of the API you are integrating with.

### auth -> authorization_params
_Default: Optional, if not specified no additional parameters are passed_

Specifies any additional parameters (besides the mandatory ones required by the OAuth protocol) which should be passed to with the authorization url. Some APIs allow you to customize the authorization experience by providing additional parameters, if this is the case you can use this parameter to pass your desired key-value pairs along.

### auth -> scope_separator {#integrationsConfig-auth_scope_separator}
_Default: Optional, if not specified the separator is set to a single whitespace ' '_

The separator which should be used to join the elements of the scopes array together into a string. Most APIs use a single whitespace, which is the default, but some also require a different separator such as `,`.

### auth -> token_url {#integrationsConfig-auth_token_url}
_Default: Mandatory if the `auth_mode` is set to `OAUTH2` or `OAUTH1`. Otherwise optional/not used_

The URL where the Nango OAuth server can exchange the authorization_code for an access token (and maybe also a refresh token). You will find this URL in the OAuth documentation of the API you are integrating with.

### auth -> token_params
_Default: Optional, if not specified no additional parameters are passed_

Specifies any additional parameters (besides the mandatory ones required by the OAuth protocol and the grant type) which should be passed along with the request to the token url. Some APIs require you to provide additional non-standard parameters when requesting the access token, if this is the case you can use this parameter to pass your desired key-value pairs along.

Note that this parameter is rarely used.

### auth -> authorization_method
_Default: Optional, if not specified defaults to `header`. Only applies if the `auth_mode` is set to `OAUTH2`, otherwise ignored/not used._

Allowed values are `body` and `header`.

Method used to send the client.id/client.secret authorization params at the token request. If set to `body`, the `body_format` option will be used to format the credentials. Note that this parameter is very rarely used.

### auth -> body_format
_Default: Optional, if not specified defaults to `form`. Only applies if the `auth_mode` is set to `OAUTH2`, otherwise ignored/not used._

Allowed values are `form` and `json`.

Format used to send the client.id/client.secret authorization params at the token request. Note that this parameter is very rarely used.

### auth -> refresh_url
_Default: Optional, if not specified falls back to the value of [auth -> token_url](#integrationsConfig-auth_token_url). Only applies if the `auth_mode` is set to `OAUTH2`, otherwise ignored/not used._

The URL where the Nango OAuth server can exchange the refresh token for a new access token and a new refresh token. This is almost always identical to the `token_url` parameter and hence can be omitted, only use this parameter if the refresh URL differs from the standard token URL. If required you will find this URL in the OAuth documentation of the API you are integrating with.

### auth -> request_url
_Default: Mandatory if the `auth_mode` is set to `OAUTH1`, otherwise ignored/not used._

The URL for the first step of the 3-legged OAuth 1 flow. This is the URL where the Nango OAuth server can request a new authorization flow to start. You will find this URL in the OAuth documentation of the API you are integrating with.

### auth -> request_params
_Default: Optional, if not specified no additional parameters are passed. Only applies if the `auth_mode` is set to `OAUTH1`, otherwise ignored/not used._

Specifies any additional parameters (besides the mandatory ones required by the OAuth protocol) which should be sent with the request to `request_url`. Some APIs require you to pass in additional parameters here, if so you will find the details of this in the OAuth documentation of the API you are integrating with.

### auth -> request_http_method
_Default: Optional, if not specified defaults to `POST`. Only applies if the `auth_mode` is set to `OAUTH1`, otherwise ignored/not used._

Allowed values are `POST`, `GET` and `PUT`.

HTTP Method used to make the request to `request_url`. Note that this parameter is very rarely used.

### auth -> token_http_method
_Default: Optional, if not specified defaults to `POST`. Only applies if the `auth_mode` is set to `OAUTH1`, otherwise ignored/not used._

Allowed values are `POST`, `GET` and `PUT`.

HTTP Method used to make the request to `token_url`. Note that this parameter is very rarely used.

### auth -> signature_method
_Default: Mandatory if the `auth_mode` is set to `OAUTH1`, otherwise ignored/not used._

Allowed values are `HMAC-SHA1`, `RSA-SHA1` and `PLAINTEXT`.

The cryptographic method used to sign the OAuth 1 requests. You will find this URL in the OAuth documentation of the API you are integrating with, `HMAC-SHA1` is the most popular option and thus a sane default if you are unsure.

### requests -> base_url
_Default: Mandatory, must start with either `http://` or `https://`_

The base URL of the API you are integrating with. Nango will prepend this to every endpoints called in the [httpRequest method in NangoAction](reference/actions.md#httpRequest).

### requests -> headers
_Default: Optional, but almost always needed to specify the correct authorization headers to add to requests_

The headers specified here will be added to every HTTP request made with the [httpRequest method in NangoAction](reference/actions.md#httpRequest). There are several placeholders available to substitute authorization credentials in the header, for a full list please refer to the [auth guide](guides/auth.md#requestAuth).

There is a special case with `auth_mode` `OAUTH1` where you probably do **not** want to specify an Authorization header. Please refer to the [auth guide](guides/auth.md#oauth1requests) for details.

### requests -> params
_Default: Optional, but sometimes needed to specify the correct authorization query parameters to add to requests_

The query parameters specified here will be added to every HTTP request made with the [httpRequest method in NangoAction](reference/actions.md#httpRequest). There are several placeholders available to substitute authorization credentials, for a full list please refer to the [auth guide](guides/auth.md#requestAuth).