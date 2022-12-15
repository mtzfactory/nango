# Other configuration

### Customer Callback URL

You can customize the callback URL to point to a proxy server by editing the `AUTH_CALLBACK_URL` environment variable in the `.env` file at the root of the Pizzly folder.

### CLI Host & Port

The CLI uses the host/port `http://localhost:3003` by default to call the Pizzly server. You can customize this by setting the environement variable named `PIZZLY_HOSTPORT` in your CLI environment, using a `.bashrc` or `.zshrc` file.