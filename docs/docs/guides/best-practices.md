---
sidebar_label: Best Practices
sidebar_position: 7
---

# Best Practices

This page is a collection of best practices on using Nango.

Most of them are **focused on developer productivity and knowledge transfer**: If everybody in your project follows these best practices it will be much easier for new developers to get started with your Nango integrations.

## Best practices on Action naming {#actionNaming}
Every Action in Nango has a name (cf. [Architecture](architecture.md)), which is how you call them in your code. Because the Action name is not just used by the developer writing the Action/Integration it is important that this name is descriptive and understandable.

When choosing a name for your Action we recommend that you follow this checklist:
- **Keep names short & descriptive**: All lowercase, short, but descriptive names are best. Do not include the Integration name.
    - Good examples
        - `notify` (for an Action that posts a notification to a Slack channel)
        - `import-all-contacts` (for an Action that does a full import of all contacts from a CRM)
        - `load-all-repos` (for an Action that loads all repos of a user from GitHub)
        - `update-contact` (for an Action that updates an external contact record)
    - Bad examples
        - `salesforce-load-all-contacts` (don't include the integration name)
        - `load repos` (don't use whitespaces. Also pretty unclear what exactly this does)
        - `Notify-Everyone` (don't use capital letters, keep it all lowercase)
- **Don't use whitespaces**: Because Action names are used in file name and class names (in CamelCase, see [here](guides/create-an-action.md)) use `-` or `_` instead of whitespaces
- **Re-use action names across Integrations**: If two actions in two different Integrations do the same thing (but for different systems) they should have the same name. This helps other team members and future engineers understand that these work the same way across these different Integrations. You should also, as much as possible, standardize the input these actions take so they can be called interchangeably.
    - Example: If you import contacts from a CRM each might have an `import-all-contacts` action that does the same thing.


## Best practices on integrations modeling with Nango {#actionBestPractices}

Modeling integrations in Nango should be easy in most cases and we have found that the framework lends itself well to almost all uses cases for native integrations. If you are just getting started with Nango or native integrations in general we hope these best practices set you on a path of success from day one.

### Keep Actions short and focused
[Actions are written in Typescript](reference/nango-folder.md#actionFiles) and the vast majority of actions are less than 200 lines of code. They should focus on the data exchange with the external system and focus on one specific interaction with it. Good examples are:
- Import all contacts from a CRM (which may mean dealing with pagination etc.)
- Post a message to a slack channel (where the message and channel ID get passed in as inputs)
- Load the X last commits of a GitHub repo (where X and the repo identifier are passed in as inputs)

And here are some counter examples, avoid these:
- A generic "contacts" action that takes an input parameter on whether a contact should be created, updated or deleted => Use 3 separate actions instead
- An action that posts a message to a Slack channel with a specific id => channel ids are account specific and should thus be passed in as an input (or get stored on the user's connection object)
- Including business logic that interacts with other parts of your application: actions execute within the Nango runtime and do not have access to the other parts of your application (such as your database, other services etc.)

### One integration per API of the external system
Most companies and products offer a single open API to connect to them and in this case you should model them also as 1 integration in Nango. This will be the most-common use case and cover 95%+ of the systems you want to integrate with.

However, some very big and complex products sometimes offer a number of different APIs with very different capabilities, different base URLs, sometimes different authentication and often different rate-limits. In this case it probably makes sense to model these different APIs as different Integrations in Nango, as Nango makes some assumptions about authentication, base URL and rate-limits within a given integration.

Examples of these edge-cases include advanced use cases of Shopify, whose Shopify Plus API is significantly different and Salesforce, which for instance offers a REST and Bulk API with different capabilities.
