---
sidebar_label: 'Create an Action'
sidebar_position: 2
---

# Create an Action

Actions (cf. [Architecture](architecture.md)) contain the business logic that is specific to each integration. They can be customized at will. 

Let's assume you have a `myintegration` Integration already configured (cf. [Create an Integration](guides/create-an-integration.md)).

Choose a name for your new Action, for example `notify` to send a message, `contacts` to fetch CRM records, etc. In this case, let's use `myaction`.

Create a file for our new `myaction` Action which lives in the `myintegration` folder: 
```bash
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

Note that every Action must follow the following naming patterns to the recognized by the Nango Server:
- `<action-name>.action.ts` for the Action file
- `<IntegrationName><ActionName>Action` for the Action class

The business logic of the Action will be implemented in the `executeAction` method.

Nango provides us with some helpers that we can (and should) use in our Action:
- For HTTP requests, use the built-in `this.httpRequest` method (cf. [reference](reference/actions.md#httpRequest)), which takes care of auth parameters, retries,  etc.
- For logging, use the built-in logger `this.logger` (cf. [reference](reference/logging.md))

We can now easily write the logic for our `myaction` Action:
```ts title="myaction.action.ts"
// Add this inside of executeAction
const requestBody = {
    param1: x,
    param2: y
};
const response = await this.httpRequest('/<external-api-action-path>', 'POST', undefined, requestBody);

return { status: response.status, statusText: response.statusText };
```