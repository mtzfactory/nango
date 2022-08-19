# Nango example: Hubspot Contacts Import

This example demonstrates how Nango can be used to:
- Authenticate a user with the builtin-in OAuth server
- Import data from an external API to your application: Here we import all contacts from a Hubspot account
- Push data back out to an external system: Here we add a note to a contact in Hubspot
- Store per-user-per-integration configuration data in Nango (here the Hubspot e-mail address of the Note's owner)

Of course in a real application you could store the retrieved contacts in your database, link them with other content of your application etc.

## How to use this example
Explore the code in this directory if you are curious how these features work with Nango. Here is an overview of the components:

- `app.js` is a small (Express) web server which exposes a REST API for our tiny frontend. Check this file to see all the backend Action with Nango using the Nango SDK
- `frontend/index.html` is a tiny frontend. Check this file (line 93 & following) if you want to see how you can easily trigger an OAuth flow with Nango from your frontend with just 2 lines of code.
- `nango-integrations` is the [Nango Folder](https://docs.nango.dev/reference/nango-folder) of this example and it contains
    - `nango-config.yaml` the main Nango configuration file (we don't need to touch it for this simple example)
    - `integrations.yaml` which contains all our Integrations config. Check it out to see how we set our "hubspot" integration up for this example by using the [Hubspot Blueprint](https://docs.nango.dev/blueprint-catalog/blueprint-hubspot)
    - `hubspot/get-all-contacts.action.ts` contains our "get-all-contacts" action for Hubspot and does all the interaction with the Hubspot API. Take a look to see how easy it is to fetch paginated data with Nango
    - `hubspot/add-contact-note.action.ts` contains our "add-contact-note" action for Hubspot and runs a few different Hubspot API calls to add the note to the Hubspot contact

### What Nango handles for you
So why should you use Nango to fetch the Hubspot contacts instead of calling the Hubspot API directly?

Here are all the things Nango handles for you in this example:
- OAuth 2.0 server & flow
- Automatic access token refreshes
- Access token storage & integration state management for every user
- Automatic requests authorization
- Automatic detailed logging of API interactions (see also "Extra credit" below)
- Automatic rate-limit detection & mitigation (back-off, also across different requests of the same user)
- Automatic retries if a request times out/the API is unreachable
- Automatic updates to API changes: We regularly test & update our Blueprints so your integrations always work
- Coming soon: Error handling for API-wide errors (such as when a user has revoked an access token etc.)


## How to run the example
If you want to see the example in action you can of course run it locally on your machine.

For this you need:
- A recent version of Node.js installed (>16.7)
- A recent version of Docker
- A free [developer account from Hubspot](https://developers.hubspot.com/get-started) so you can generate a `client_id` and `client_secret` for your OAuth application
- A [Hubspot Developer Test account](https://developers.hubspot.com/docs/api/account-types) setup with some sample contacts (can be setup from your developer account)

We assume you have your OAuth app setup with Hubspot and the test account is ready.
Alright then, let's dive in!

In a terminal cd to this directory and run:
```bash
npm install
```

This will install the dependencies of this example (Nango's node.js client SDK and the Express HTTP server).

Next we need to install the dependencies of the Nango Folder and start compilation of the Typescript code there:
```bash
cd nango-integrations
npm install
node_modules/typescript/bin/tsc -w --project tsconfig.json
```

Now open `integrations.yaml` in your favorite editor and add the `client_id` of your Hubspot OAuth app:
```yaml
integrations:

    hubspot:
        extends_blueprint: hubspot:v0
        log_level: info

        oauth_client_id: <Add your client_id here> # Replace with your own client id
        oauth_client_secret: ${HUBSPOT_CLIENT_SECRET}
        oauth_scopes:
            - crm.objects.contacts.read
```

Whilst you're at it, create a file called `.dev-secrets` within the nango-integrations folder and add your `client_secret` in there:
```bash
touch .dev-secrets

# Add this to the file (replace <Your client_secret>): HUBSPOT_CLIENT_SECRET="<Your client_secret>"
```

If you are curious what the `.dev-secrets` file is about [read up on it here](https://docs.nango.dev/local-development#secrets).

Time to start the Nango server. With your terminal still in nango-integrations run:
```bash
docker compose up # or if this does not work try docker-compose up
```

You should see two containers getting started and after a while the Nango server will print `[SERVER-MAIN] ✅ Nango Server is ready!`.

Open a new terminal, cd back to the example directory and start our example application:
```bash
npm run start
```

In your browser go to `http://localhost:3000` and you should see our minimalist frontend.

Go ahead, try the OAuth, if your client_id & client_secret are set correct it should work out of the box. Once you are connected you can import/refresh the contacts list with the button below.

## Extra credit
If you want to see the powerful Nango logging in action edit the `integrations.yaml` file and change the `debug_level` of the "hubspot" integration to `debug`. Make sure you save the file but you do not need to restart the server: In local development mode the Nango server watches this file and reloads it automatically on every save.

Nango will now log much more details as well as the full details of every HTTP request & response from the Hubspot API. To see this just hit the "Refresh contacts" button again.