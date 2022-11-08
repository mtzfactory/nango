import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncGoogleCalendarEvents [CalendarID] [OAuth token]
// Endpoint documentation: https://developers.google.com/calendar/api/v3/reference/events/list
export let syncGoogleCalendarEvents = async (calendar_id: string, oauth_token: string) => {
    let config = {
        headers: {
            'Authorization': `Bearer ${oauth_token}`
        },
        unique_key: 'id',
        response_path: 'items',
        paging_cursor_request_path: 'pageToken',
        paging_cursor_metadata_response_path: 'nextPageToken'
    };

    return Nango.sync(`https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events`, config);
};