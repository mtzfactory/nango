import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncTypeformResponses [api-token] [form-id]
// Endpoint docs: https://developer.typeform.com/responses/reference/retrieve-responses/
export let syncTypeformResponses = async (api_token: string, form_id: string) => {
    let config = {
        friendly_name: 'Typeform Responses',              // For pretty logs.
        response_path: 'items',                           // For finding records in the API response.
        paging_cursor_request_path: 'before',             // For adding pagination data in requests.
        paging_cursor_object_response_path: 'token',      // For finding pagination data in responses.
        headers: { authorization: `Bearer ${api_token}` } // For auth.
    };

    return new Nango().sync(`https://api.typeform.com/forms/${form_id}/responses`, config);
};
