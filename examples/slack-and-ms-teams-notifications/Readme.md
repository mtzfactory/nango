# Nango example: Slack & MS Teams notifications

This example allows a user to authenticate either their Slack workspace or their MS Teams team.  
It then loads the list of all channels (either from Slack or MS Teams) and lets the user pick the channel where they would like to receive notifications.

Last but not least you can send a notification and the app will either send it to MS Teams or Slack, depending on which the user has setup.

Take a look at this example to learn how you can:
- Authenticate a user with the builtin-in OAuth server
- Load data (such as the list of channels) in real time from an external API
- Push data back out to an external system: Here we send a notification message to either Slack or MS Teams
- Query integration data from Nango to learn which integration(s) a user has setup
- Store per-user-per-integration configuration data in Nango (here the id of the user's favorite notification channel)

Feel free to copy and paste snippets (especially the action code in the `nango-integrations` folder) from this example into your application!

## How to use this example
Explore the code in this directory if you are curious how these features work with Nango. Here is an overview of the components:

- `app.js` is a small (Express) web server which exposes a REST API for our tiny frontend. Check this file to see all the backend Action with Nango using the Nango SDK
- `frontend/index.html` is a tiny frontend. Check this file (line 93 & following) if you want to see how you can easily trigger an OAuth flow with Nango from your frontend with just 2 lines of code.
- `nango-integrations` is the [Nango Folder](https://docs.nango.dev/reference/nango-folder) of this example and it contains
    - `nango-config.yaml` the main Nango configuration file (we don't need to touch it for this simple example)
    - `integrations.yaml` which contains all our Integrations config. Check it out to see how we set our "slack" and "ms-teams" integrations up for this example by using the [Slack Blueprint](https://docs.nango.dev/blueprint-catalog/blueprint-slack) and the [MS Teams Blueprint](https://docs.nango.dev/blueprint-catalog/blueprint-microsoft-teams)
    - `slack/list-channels.action.ts` contains our "list-channels" action for Slack and loads a list of all channels our app can see from Slack
    - `slack/notify.action.ts` contains the "notify" action for Slack which sends a message to the user's favorite notifications channel
    - `ms-teams/list-channels.action.ts` contains our "list-channels" action for MS Teams and loads a list of all channels (across all Teams the user is part of) our app can see from MS Teams
    - `ms-teams/notify.action.ts` contains the "notify" action for MS Teams which sends a message to the user's favorite notifications channel

### What Nango handles for you
So why should you use Nango to build notifications for Slack & MS Teams instead of calling the respective APIs directly?

Well, we actually pre-built the integration for you here :) Just copy-paste the `nango-integrations` folder from this example and you have fully working notifications for Slack & MS Teams.

But apart from that, here are all the things Nango handles for you in this example:
- OAuth 2.0 server & flow
- Easy abstraction to call either Slack or MS Teams api, depending on what the user has configured
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
- A [registered Slack app](https://api.slack.com) so you can generate a `client_id` and `client_secret` for your OAuth application
- A [registered MS Graph API app](https://docs.microsoft.com/en-us/graph/auth-register-app-v2) so you can generate a `client_id` and `client_secret` for your OAuth application (MS Teams uses the Microsoft Graph API). There are some "gotchas" in this process, check our [MS Teams Blueprint](https://docs.nango.dev/blueprint-catalog/blueprint-microsoft-teams) for some tips and how to get MS Teams if you don't already have it installed

We assume you have your OAuth apps setup with Slack & MS Teams and the test account is ready.
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

Now open `integrations.yaml` in your favorite editor and add the `client_id` of your Slack & MS-Teams OAuth app:
```yaml
integrations:

    slack:
        extends_blueprint: slack:v0
        log_level: info

        oauth_client_id: <Add your client_id here> # Replace with your own client id
        oauth_client_secret: ${SLACK_CLIENT_SECRET}
        oauth_scopes:
            - 'chat:write'
```

Whilst you're at it, create a file called `.dev-secrets` within the nango-integrations folder and add your `client_secret` in there:
```bash
touch .dev-secrets

# Add this to the file (replace <Your client_secret>):
SLACK_CLIENT_SECRET="<Your client_secret>"
MS_TEAMS_CLIENT_SECRET="<Your client_secret>"
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

Go ahead, try the OAuth, if your client_id & client_secret are set correct it should work out of the box. Once you are connected you can pick the channel to send notifications to and send notifications. 

## Extra credit
If you want to see the powerful Nango logging in action edit the `integrations.yaml` file and change the `debug_level` of the "ms-teams" integration to `debug`. Make sure you save the file but you do not need to restart the server: In local development mode the Nango server watches this file and reloads it automatically on every save.

Nango will now log much more details as well as the full details of every HTTP request & response from the MS Teams API. To see this just hit the "Refresh contacts" button again.