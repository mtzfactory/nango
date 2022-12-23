import { Nango } from '@nangohq/node-client';

// Test from the 'nango' folder root with command: npm run example syncTypeformResponses [FORM-ID] [APP-TOKEN]
// Endpoint docs: https://developer.typeform.com/responses/reference/retrieve-responses/
export let syncTypeformResponses = async (formId: string, appToken: string) => {
    let config = {
        friendly_name: 'Typeform Responses', // Give this Sync a name for prettier logs.
        mapped_table: 'typeform_responses', // Name of the destination SQL table.
        headers: { authorization: `Bearer ${appToken}` }, // For auth.
        response_path: 'items', // For finding records in the API response.
        paging_cursor_request_path: 'before', // For adding pagination data in requests.
        paging_cursor_object_response_path: 'token', // For finding pagination data in responses.
        max_total: 100, // For fetching limited records while testing.
        frequency: '1 minute' // How often sync jobs run in natural language.
    };

    return new Nango().sync(`https://api.typeform.com/forms/${formId}/responses`, config);
};
