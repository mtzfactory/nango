import { Nango } from '@nangohq/node-client';

// Test from the 'nango' folder root with command: npm run example syncGoogleCalendarEvents [CALENDAR_ID] [PIZZLY-PROVIDER-CONFIG-KEY] [PIZZLY-CONNECTION-ID]
// Endpoint documentation: https://developers.google.com/calendar/api/v3/reference/events/list
export let syncGoogleCalendarEvents = async (calendar_id: string, pizzlyProviderConfigKey: string, pizzlyConnectionId: string) => {
    let config = {
        friendly_name: 'Google Cal Events', // Give this Sync a name for prettier logs.
        headers: { Authorization: 'Bearer ${pizzlyAccessToken}' }, // For auht.
        unique_key: 'id', // Provide response field path for deduping records.
        response_path: 'items', // For finding records in the API response.
        paging_cursor_request_path: 'pageToken', // For adding pagination data in requests.
        paging_cursor_metadata_response_path: 'nextPageToken', // For finding pagination data in responses.
        max_total: 100, // For fetching limited records while testing.
        frequency: '1 minute', // How often sync jobs run in natural language.
        pizzly_connection_id: pizzlyConnectionId, // Pre-configured Pizzly connection ID (cf. github.com/NangoHQ/Pizzly).
        pizzly_provider_config_key: pizzlyProviderConfigKey // Pre-configured Pizzly provider configuration (cf. github.com/NangoHQ/Pizzly).
    };

    return new Nango().sync(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`, config);
};
