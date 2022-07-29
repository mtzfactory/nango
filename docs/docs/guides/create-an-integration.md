---
sidebar_label: 'Create an Integration'
sidebar_position: 1
---

# Create an Integration

In a new terminal, navigate to the Nango Folder:
```bash
cd <your-project-root>/nango-integrations
```

Choose a name for your integration (e.g. 'slack', 'salesforce', etc.), here let's use `myintegration`.

Open the `integrations.yaml` file and copy/paste the configuration for a new Integration under the `integrations` key:
```yaml title="integrations.yaml"
- myintegration:
    base_url: https://myintegration.com/api/
    call_auth:
        mode: AUTH_HEADER_TOKEN
    log_level: debug
```

Let's briefly unwrap each of these fields (check the [reference](reference/configuration.md#integrationsYaml) for details): 
- `myintegration` is the name of your integration in Nango, you will use this string to reference it everywhere
- `base_url` is the 3rd-party API's base URL to be used for http requests
- `call_auth: mode:` setting this to `AUTH_HEADER_TOKEN` tells Nango to add a standard Bearer token to every HTTP header to authorize your requests
- `log_level` indicates how verbose we want Nango's logs for this integration to be. `debug` is best for development to have maximum visibility and will log, amongst other things, every HTTP request we make from the integration (cf. [log levels](reference/logging.md)).

:::tip
See the [Quickstart](quickstart/node.md##create-an-integration) for a concrete example.
:::

Create a directory called `myintegration` directly under the `nango-integrations` folder to host the code for your new Integration. In the Nango Folder, run:
```bash
mkdir myintegration
```

Note that the Integration name in `integrations.yaml` must match the Integration folder name, in order for the Nango server to correctly load this integration.
