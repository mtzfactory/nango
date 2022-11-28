import { Nango } from '@nangohq/node-client';

// CLI command: npm start syncTypeformResponses [api-token] [form-id]
// Endpoint docs: https://developer.typeform.com/responses/reference/retrieve-responses/
export let syncTypeformResponses = async (api_token: string, form_id: string) => {
    let config = {
        response_path: 'items',
        paging_cursor_request_path: 'before',
        paging_cursor_object_response_path: 'token',
        headers: {
            authorization: `Bearer ${api_token}`
        }
    };

    return new Nango().sync(`https://api.typeform.com/forms/${form_id}/responses`, config);
};
