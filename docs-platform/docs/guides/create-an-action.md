---
sidebar_label: 'Create an Action'
sidebar_position: 2
---

# Create an Action

Actions (cf. [Architecture](architecture.md)) contain the business logic that is specific to each integration. If you are not familiar with their function yet please take a brief look at the Architecture page first.

## Adding a new Action to an existing Integration

Every Action is part of an Integration. To add a new Action you must create the Integration first, if you don't have any setup yet please take a look at the [Create an Integration](guides/create-an-integration.md) guide.

Let's assume you have an Integration called `myintegration` already configured.

First you need to choose a name for your new Action. The only two requirements from Nango are that your Action name must be unique within the Integration and that it cannot contain any whitespaces. But because the Action name is so important we have a few [additional best practices](guides/best-practices.md#actionNaming) which we recommend you follow.

In this case, let's use `myaction`, because we will keep this example very generic.

Create a file for our new `myaction` Action which lives in the `myintegration` folder: 
```bash
# We assume you are in the nango-integrations/myintegration folder
touch myaction.action.ts
```

Open the `myaction.action.ts` file and paste the following scaffold into it:
```typescript title="myaction.action.ts"
import { NangoAction } from '@nangohq/action';

class MyIntegrationMyActionAction extends NangoAction {

    override async executeAction(input: any) {
        // Add your Action code here
    }
}

export { MyIntegrationMyActionAction };
```

Note that every Action must follow these naming patterns to the recognized by the Nango Server:
- `<action-name>.action.ts` for the Action file
- `<IntegrationName><ActionName>Action` in CamelCase for the Action class

## Writing your Action business logic

The business logic of your Action is implemented in the `executeAction` method. When you trigger the Action (cf. [trigger an Action](guides/trigger-an-action.md) guide) from your code, the Nango server will load your action file and call `executeAction(input)` along with the input you specified.

Typically the input is a small object which tells the Action what should be posted/updated/imported. Common examples are:
- For Slack notifications, the channelID & message to post
- For CRM contacts import, additional filters to apply
- For CRM contacts updating, the field to update, the new value and the contact's external ID in the CRM

Note that because an action always gets triggered in the context of a specific user's Connection you do not have to pass in the user-id, auth token or similar per-user configuration. Nango already has all the credentials it needs to add authorization details to your request.

To make writing your business logic easier Nango provides you with some helpers that you can (and should) use in your Action (check the [NangoAction reference](reference/actions.md) for all available methods):
- For HTTP requests, use the built-in `this.httpRequest` method (cf. [reference](reference/actions.md#httpRequest)), which takes care of auth parameters, retries,  etc.
- For logging, use the built-in logger `this.logger` (cf. [reference](reference/logging.md)), which automatically adds useful metadata to your logging statements

We can now easily write the logic for our `myaction` Action:
```ts title="myaction.action.ts"
// Add this inside of executeAction
const requestBody = {
    param1: x,
    param2: y
};
const response = await this.httpRequest('/<external-api-action-path>', 'POST', undefined, requestBody);

this.logger.info(`API request has completed with status ${response.status}`);

return { status: response.status, statusText: response.statusText };
```

Note that the returned data here is just an example: You can return any data you want as long as it is JSON serializable and Nango will return it in the `triggerAction` call in your application. You can find more details on input & return values from actions in the [NangoAction reference](reference/actions.md#inputReturnValues).


## Diving deeper: More complex Action examples
Actions in Nango are typically small, well contained pieces of code. But they can, and do, get a bit more complex than the very simple and straightforward example above.

To get a better idea of what is possible with Actions in Nango, and to really understand the execution framework they run in, we recommend you take a look at these resources:
- The [Nango Action reference](reference/actions.md) explains the execution environment, available methods & behaviours in detail. If you are unsure how something works this is the place to start
- Take a look at the [Hubspot contacts importer example](https://github.com/NangoHQ/nango/tree/main/examples/hubspot-contacts-import) for an example of a more complex Action with multiple HTTP calls, dynamic requests construction and an example of retrieving paged content.
- [Nango's own Nango Folder](https://github.com/NangoHQ/nango/tree/main/nango-integrations) also contains a number of different Actions doing everything from sending Slack messages and tweets to importing larger amounts of data.

## Next steps

Congratulations, your Integration now has an Action and is ready to be called from your code.

To learn more on how to do this read on with the [Trigger an Action](guides/trigger-an-action.md) guide.