---
sidebar_label: Framework Overview
sidebar_position: 1
---

# Nango integrations framework overview

At the heart of Nango is a simple, but powerful framework for integrations. It ensures that Nango can provide powerful infrastructure and solve many development and runtime issues around native integrations for you.

## A simple integration example
As an example, imagine you are a new startup and want to integrate with Salesforce so your customers can load their contacts from Salesforce into your system.

You also want to write data back into Salesforce, for instance whenever a contact opens an email that was sent through your system you want to write that back to Salesforce:

![A startup integrates with Salesforce](/img/startup-salesforce-integration.png)

As a new startup, Salesforce will probably not build anything towards you, so you have to use the Salesforce API to build this native integration yourself.

SuperStartup uses Nango, so it will model its Salesforce integration like this:

![The Nango model of SuperStartup integration with Salesforce](/img/startup-salesforce-nango-model.png)

Integrations in Nango are always built from 3 basic components:

- An **Integration** in Nango is a connection between your product and an external system. In the example here we talk about the "Salesforce Integration", but SuperStartup could also have additional integrations, such as a "Mailchimp Integration", "Shopify Integration" or "Slack Integration".
- Integrations contain **Actions**, these are the interactions between your product and the external system. In our example here the Salesforce Integration supports 2 Actions: "Import all contacts" and "Log an email opened event". Actions are what you call in your code to execute interactions with the external system and you can define them as you wish (although we do have some best practices and recommendations for you).
- Finally there are **Connections**, when an end-user sets up an Integration between your product and the external system we call this a Connection. A Connection always belongs to a specific Integration as well as an end-user. In our example here the Connection is with your Salesforce Integration and the end-user Anna. Connection objects store the authentication details of the user for this Integration as well as any additional (per user) configuration you specify, e.g. a filter for which contacts should be imported or a mapping of a user's custom fields.

![The Nango model of SuperStartup integration with Salesforce - annotated](/img/startup-salesforce-nango-model-annotated.png)

In this documentation we capitalize these terms when they refer to their Nango specific meaning, look out for Integration, Action and Connection mentions on these pages!

## Blueprints: Community contributed Actions
**TODO: ADD DETAILS ON WHERE TO FIND BLUEPRINTS**

A big advantage of the Nango framework is that Integrations and Actions can be contributed and shared by the community:
In our example above SuperStartup wants to import contacts from Salesforce. It is unlikely that SuperStartup is the first company looking to support this Action in their product, so they can check the Nango Blueprints repository to see if somebody has already contributed this Action.

![An illustration that shows how Blueprints work in Nango](/img/nango-blueprints-illustration.png)

If they find one that they like they can just copy this Blueprint into their codebase (see [[Importing a Blueprint]]) and use it as is or treat it as a base from which to customize their own "Import all contacts" Action.
All community and Nango contributed Blueprints are licensed under the same permissive license as Nango itself so you can use them without having to worry about licensing.

Blueprints that are shared on Nango always contain the following details:
- Basic API configuration for the Integration (e.g. base API URL, authentication details, rate-limit metadata)
- Implementations of specific Actions for the Integration
- A brief description of each impleneted Action, it's input objects and information on the author & maintainer

Because we know that Blueprints are only helpful when they are maintained and work we take QA very seriously:
- All Blueprints are hosted in our main Nango repository and undergo a QA review by a Nango maintainer before merging
- We develop tooling that makes it easy for Blueprint authors & maintainers to (periodically) test their Blueprints
- We develop tooling that automatically periodically tests all Blueprints to make sure they work and are up to date with the respective APIs
- We offer community support for all Blueprints on the Nango Slack

## Best-practices on Integrations modelling with Nango

Modelling Integrations in Nango should be easy in most cases and we have found that the framework lends itself well to almost all uses cases for native integrations. If you are just getting started with Nango or native integrations in general we hope these best practices set you on a path of success from day one.

### Keep Actions short and focused
Actions are written in Typescript [[LINK TO DETAILS]] and the vast majority of Actions are less than 200 lines of code. They should focus on the data exchange with the external system and focus on one specific interaction with it. Good examples are:
- Import all contacts from a CRM (which may mean dealing with pagination etc.)
- Post a message to a slack channel (where the message and channel ID get passed in as inputs)
- Load the X last commmits of a GitHub repo (where X and the repo identifier are passed in as inputs)

And here are some counter examples, avoid these:
- A generic "contacts" action that takes an input parameter on whether a contact should be created, updated or deleted => Use 3 separacte actions instead
- An Action that posts a message to a Slack channel with a specific id => Channel ids are account specific and should thus be passed in as an input (or get stored on the user's Connection object, see below)
- Including business logic that interacts with other parts of your application: Actions execute within the Nango runtime and do not have access to the other parts of your application (such as your database, other services etc.)

### Actions that do the same thing should have consistent names across Integrations
If it does the same thing it should have the same name.

For example, if you integrate with three different CRM systems and you support importing contacts from each it is a best practice to name the Action that does this import the same for all three Integrations. "Import all contacts" might be a reasonable name.

This helps other team members and future engineers understand that these work the same way across these different Integrations. You should also, as much as possible, standardize the input these actions take so they can be called interchangeably.

### One Integration per API of the external system
Most companies and products offer a single open API to connect to them and in this case you should model them also as 1 Integration in Nango. This will be the most-common use case and cover 95%+ of the systems you want to integrate with.

However, some very big and complex products sometimes offer a number of different APIs with very different capabilities, different base URLs, sometimes different authentication and often different rate-limits. In this case it probably makes sense to model these different APIs as different Integrations in Nango, as Nango makes some assumptions about authentication, base URL and rate-limits within a given Integration.

Examples of these edge-cases include advanced use cases of Shopify, whose Shopify Plus API is significantly different and Salesforce, which for instance offers a REST and Bulk API with different capabilities.
