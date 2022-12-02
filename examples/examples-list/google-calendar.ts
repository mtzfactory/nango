import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncGoogleCalendarEvents [CalendarID] [OAuth token]
// Endpoint documentation: https://developers.google.com/calendar/api/v3/reference/events/list
export let syncGoogleCalendarEvents = async (calendar_id: string, oauth_token: string) => {
    let config = {
        friendly_name: 'Google Cal Events',                    // For pretty logs.
        headers: { 'Authorization': `Bearer ${oauth_token}` }, // For auht.
        unique_key: 'id',                                      // For deduping records.
        response_path: 'items',                                // For finding records in the API response.
        paging_cursor_request_path: 'pageToken',               // For adding pagination data in requests.
        paging_cursor_metadata_response_path: 'nextPageToken'  // For finding pagination data in responses.
    };

    return new Nango().sync(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`, config);
};