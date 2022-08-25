---
sidebar_position: 3
sidebar_label: User authentication
---

# Authenticating end users

This section covers how you implement Nango so end users can connect their CRM and you can access their data through the Nango unified CRM API.

## Adding Nango to your application

In your frontend you can trigger a new integration with this small snippet of code using our tiny frontend SDK (obtain the app ID from your Nango dashboard):
```js
import Nango from '@nangohq/frontend'

var nango = new Nango('<your-app-id>');

// Trigger a new integration for a CRM systems
nango.connect('crm')
    .then((user_token) => {
        console.log(`CRM has been connected, the user token is: "${user_token}"`);
    })
    .catch((error) => {
        console.error(`There was an error in the OAuth flow to set the integration up: ${error.error.type} - ${error.error.message}`);
    });
```

When you trigger the connection Nango opens a new window which walks the user through connecting their CRM

When the connection succeeds Nango returns a `user token`. This user token uniquely identifies the connected CRM in our system and you need to supply it with every API call you make to Nango so we know for which use you are querying data. Check [API Basics](basics.md) for details on how to pass the user token.

You should store the user token, along with the information that this user has setup a CRM integration, in your backend.

:::tip The user token is **not** a secret
Note that the user token is not a secret so you can use it in your frontend and wherever you see fit. It is just an ID that identifies the connection in Nango, the actual access tokens or api keys are secure stored in Nango and cannot be accessed with the user token.
:::

## Fetching data for the user
You are ready to use the Nango API!

Now that you have a user token you can start making requests to the Nango API, for instance [Fetch all contacts](fetch-contacts.md) from the CRM.