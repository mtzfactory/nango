---
sidebar_label: Best Practices
sidebar_position: 6
---

# Best Practices

## Best-practices on integrations modeling with Nango {#actionBestPractices}

Modeling integrations in Nango should be easy in most cases and we have found that the framework lends itself well to almost all uses cases for native integrations. If you are just getting started with Nango or native integrations in general we hope these best practices set you on a path of success from day one.

### Keep Actions short and focused
[Actions are written in Typescript](nango-integrations-folder.md#actionFiles) and the vast majority of actions are less than 200 lines of code. They should focus on the data exchange with the external system and focus on one specific interaction with it. Good examples are:
- Import all contacts from a CRM (which may mean dealing with pagination etc.)
- Post a message to a slack channel (where the message and channel ID get passed in as inputs)
- Load the X last commits of a GitHub repo (where X and the repo identifier are passed in as inputs)

And here are some counter examples, avoid these:
- A generic "contacts" action that takes an input parameter on whether a contact should be created, updated or deleted => Use 3 separate actions instead
- An action that posts a message to a Slack channel with a specific id => channel ids are account specific and should thus be passed in as an input (or get stored on the user's connection object)
- Including business logic that interacts with other parts of your application: actions execute within the Nango runtime and do not have access to the other parts of your application (such as your database, other services etc.)

### Actions that do the same thing should have consistent names across Integrations
If it does the same thing it should have the same name.

For example, if you integrate with three different CRM systems and you support importing contacts from each it is a best practice to name the action that does this import the same for all three Integrations. "Import all contacts" might be a reasonable name.

This helps other team members and future engineers understand that these work the same way across these different Integrations. You should also, as much as possible, standardize the input these actions take so they can be called interchangeably.

### One integration per API of the external system
Most companies and products offer a single open API to connect to them and in this case you should model them also as 1 integration in Nango. This will be the most-common use case and cover 95%+ of the systems you want to integrate with.

However, some very big and complex products sometimes offer a number of different APIs with very different capabilities, different base URLs, sometimes different authentication and often different rate-limits. In this case it probably makes sense to model these different APIs as different Integrations in Nango, as Nango makes some assumptions about authentication, base URL and rate-limits within a given integration.

Examples of these edge-cases include advanced use cases of Shopify, whose Shopify Plus API is significantly different and Salesforce, which for instance offers a REST and Bulk API with different capabilities.
