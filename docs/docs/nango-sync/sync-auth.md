import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Request Authentication

### OAuth

Nango leverages our sister project [Pizzly](https://github.com/NangoHQ/Pizzly) to handle authentication with OAuth APIs. 

Pizzly + Nango let you: 
- Initiate OAuth user authentication flows from your frontend with the Pizzly frontend SDK
- Automatically authenticate Nango requests, using access tokens maintained fresh by Pizzly

To leverage Pizzly in Nango, you only need to set the `PIZZLY_BASE_URL` environment variable in the `.env` file at the root of Nango's folder. 

Then, specify the `pizzly_connection_id` and `pizzly_provider_config_key` parameters in your [Sync config options](sync-all-options.md).

To use Pizzly, with or without Nango, start [here](https://github.com/NangoHQ/Pizzly).

### Other authentication methods

For other authentication methods that do not require frequent refreshes of credentials, you can simply specify the authentication information in the `headers`, `body` and `query_params` parameters in the [Sync config options](sync-all-options.md).

## Problems with your Sync? We are here to help!

If you need help or run into issues, please reach out! We are online and responsive all day on the [Slack Community](https://nango.dev/slack).