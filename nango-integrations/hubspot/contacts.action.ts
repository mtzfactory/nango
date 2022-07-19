import { NangoAction } from '@nangohq/utils';

class HubspotContactsAction extends NangoAction {
    override async executeAction(input: { limit?: number }) {
        this.logger.info(`HubspotContactsAction has been called with input:\n${JSON.stringify(input)}`);

        // Execute our Hubspot API call to post the message
        // using the builtin Nango httpRequest method
        const requestBody = {
            limit: input.limit || 10 // Default to a maximum of 10 contacts.
        };
        var response = await this.httpRequest('crm/v3/objects/contacts', 'GET', undefined, requestBody);

        return { status: response.status, statusText: response.statusText };
    }
}

export { HubspotContactsAction };
