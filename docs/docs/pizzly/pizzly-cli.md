# CLI

You can manage your Provider Configurations & Connections using the Pizzly CLI. 

Run `npx pizzly` to get a list of all CLI commands.

## Set up the Pizzly host

By default, The CLI uses the host/port `http://localhost:3003` to call the Pizzly server. You can customize this by setting the environment variable named `PIZZLY_HOSTPORT` in your CLI environment, using a `.bashrc` or `.zshrc` file.

## Manage Provider Configurations

### List

Run `npx pizzly config:list` to list all existing Provider Configurations.

### Get

Run `npx pizzly config:get <provider_config_key>` to get a specific Provider Configurations.

### Create

Run `npx pizzly config:create <provider_config_key> <provider> <oauth_client_id> <oauth_client_secret> <oauth_scopes>` to create a new Provider Configuration. If specifying multiple OAuth scopes in `<oauth_scopes>`, they should be separated by commas (e.g. `oauth,read`).

### Edit

Run `npx pizzly config:edit <provider_config_key> <provider> <oauth_client_id> <oauth_client_secret> <oauth_scopes>` to edit an existing Provider Configuration. If specifying multiple OAuth scopes in `<oauth_scopes>`, they should be separated by commas (e.g. `oauth,read`).

### Delete

Run `npx pizzly config:delete <provider_config_key>` to delete an existing Provider Configuration.

## Manage Connections

### Get

Run `npx pizzly connection:get <connection_id>` to get a Connection with credentials. 