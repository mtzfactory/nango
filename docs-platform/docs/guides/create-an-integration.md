---
sidebar_label: 'Create an Integration'
sidebar_position: 1
---

# Create an Integration

This guide walks you through how to create a new Integration in Nango. If you are not familiar with what an Integration is, please take a look at the [Architecture](architecture.md) doc first.

There are two ways to add a new Integration to Nango:

1. By extending an existing [Nango Blueprint](blueprint-catalog/blueprint-overview.md) (recommended if a matching Blueprint exists)
2. By adding a new Integration from scratch

We will briefly cover both of these options, though most of the time you will be able to build on top of a Blueprint.

## Adding a new Integration from a Nango Blueprint {#fromBlueprint}

Check the [Nango Blueprint catalog](blueprint-catalog/blueprint-overview.md) to see if Nango already has a Blueprint for the API you are looking to integrate. If you cannot find your API there you will need to add an integration from scratch, follow [these steps](#fromScratch).

In a new terminal, navigate to the Nango Folder:
```bash
cd <your-project-root>/nango-integrations
```

Choose a name for your integration (e.g. 'slack', 'salesforce', etc.), it is a best practice to use the name of the external api/product in all lowercase letters and without whitespaces. The integration's name must be unique amongst all the integrations in your Nango Folder.

For the guide here we will assume that we want to integrate with Slack, so we can use the [Slack Nango Blueprint](blueprint-catalog/blueprint-slack.md), and use `slack` as the integration name.

Open the `integrations.yaml` file and copy/paste this configuration under the `integrations` key:
```yaml title="integrations.yaml"
integrations:
    # ... you other integrations
    slack:
        extends_blueprint: slack:v0
        log_level: debug

        oauth_client_id: <Paste your Slack client id>
        oauth_client_secret: ${SLACK_CLIENT_SECRET}
        oauth_scopes:
            - your slack
            - scopes
```

Let's briefly unwrap each of these fields (check the [integrations config reference](reference/configuration.md#integrationsYaml) for more details): 
- `slack` is the name of your integration in Nango, you will use this string to reference it everywhere
- `extends_blueprint` tells Nango that we want to use the existing Slack Blueprint. The `v0` indicates the version of the Blueprint we want to use, you can find all versions and their meaning on the [Slack Blueprint](blueprint-catalog/blueprint-slack.md) page
- `log_level` indicates how verbose we want Nango's logs for this integration to be. `debug` is best for development to have maximum visibility and will log, amongst other things, every HTTP request we make from the integration (cf. [log levels](reference/logging.md)).
- `oauth_*` parameters allow Nango to provide built-in OAuth support for your new Integration. You get the client_id and client_secret by registering your application with Slack and the possible scopes are listed in the Slack API documentation (check the Blueprint page for a direct link).

Because (OAuth) secrets should never be committed to your source code Nango supports storing them in environment variables. Check the [local development](local-development.md#secrets) page to see how you can easily pass them to Nango.

To trigger the OAuth flow for your new Slack integration you just need to [make a simple call from your fronted](guides/auth.md#frontendOauth). Nango will then automatically run the OAuth flow and store the user credentials so you can start executing Actions for that user.

:::info
Besides OAuth 2.0 and 1.0a Nango also supports other methods of authentication, the Blueprint page will always tell you which method the API uses and how you can use it with Nango.
:::

To finish the setup of your new integration
Create a directory called `slack` directly under the `nango-integrations` folder to host the code for your new Integration. In the Nango Folder, run:
```bash
mkdir slack
```

Note that the Integration name in `integrations.yaml` must match the Integration folder name, otherwise the Nango server will be unable to load the actions for this integration.

## Adding a new Integration from scratch {#fromScratch}

If Nango doesn't yet have a Blueprint for the API you are looking to integrate you have two options:

1. You can specify the authentication & request authorization yourself, Nango works with every API and the Blueprints are just a convenience, not a requirement.
2. You can reach out to us in the [Slack community](https://nango.dev/slack), we are always looking to extend our Blueprints catalogue and are happy to add a Blueprint for your favorite API!

If you want to create your own Integration from scratch this is entirely possible and usually takes only 20-30 minutes. These guides will help you:
- Read our [auth guide](guides/auth.md) for a step-by-step guide on authentication and request authorization
- Check the [`integrations.yaml` reference](reference/configuration.md#integrationsYaml) for all the details on the possible configuration options & examples
- You might also want to look at the Blueprints of other APIs, you can find them all in the [blueprints folder in our GitHub repo](https://github.com/NangoHQ/nango/tree/main/blueprints)

If you need help always feel free to reach out on the Community Slack, we are very active there and will be happy to help you out!


## Next steps
That's it, you successfully added a new Integration to Nango 🎉

As a next step, you probably want to [add an action](guides/create-an-action.md) to your Integration so it can interact with the external API.
