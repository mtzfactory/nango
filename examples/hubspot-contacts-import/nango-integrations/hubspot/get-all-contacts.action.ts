/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAction } from '@nangohq/action';

class HubspotContactsAction extends NangoAction {
    // This Action fetches all HubSpot contacts up to an optional upper limit
    // The fields returned are all fields under the group "Contact Information", see below
    // This may include custom fields the Hubspot customer has added for the Contacts entity.
    override async executeAction(input: { limit?: number }) {
        this.logger.info(`HubspotContactsAction has been called with input:\n${JSON.stringify(input, null, 2)}`);

        // The fields available on the contacts differ depending on the Hubspot instance type
        // and custom fields the user has added.
        // To make sure we request all the fields that exist related to a contacts we first query for
        // all the fields associated with the "Contact Information" field group. There are other fields available if you need them.
        // For details on this check the Hubspot API docs here: https://developers.hubspot.com/docs/api/crm/properties
        const fieldsResponse = await this.httpRequest('/crm/v3/properties/contacts', 'GET');
        fieldsResponse.json = JSON.parse(fieldsResponse.data);
        let contactProperties = [];
        if (fieldsResponse.status === 200) {
            for (const field of fieldsResponse.json.results) {
                if (field.groupName === 'contactinformation') {
                    contactProperties.push(field.name);
                }
            }
        } else {
            throw new Error(`Got an error fetching contact properties from Hubspot, cannot complete Action: ${JSON.stringify(fieldsResponse.data, null, 2)}`);
        }

        // Let's fetch the contacts
        let hubspotContacts = [];
        let done = false;
        let pageCursor = null;
        let maxNumberOfRecords = input && input.limit ? input.limit : Number.MAX_VALUE;

        while (!done) {
            const params = {
                limit: maxNumberOfRecords - hubspotContacts.length < 50 ? (maxNumberOfRecords - hubspotContacts.length).toString() : '50', // Get up to 50 records per page
                properties: contactProperties.join(','),
                after: pageCursor
            };

            // Get a chunk of contacts
            // See Hubspot docs for return object shape: https://developers.hubspot.com/docs/api/crm/contacts
            let response = await this.httpRequest('/crm/v3/objects/contacts', 'GET', params);
            response.json = JSON.parse(response.data);

            if (response.status === 200) {
                hubspotContacts = hubspotContacts.concat(response.json.results);

                if (response.json.paging && hubspotContacts.length < maxNumberOfRecords) {
                    pageCursor = response.json.paging.next.after;
                } else {
                    done = true;
                }
            } else {
                throw new Error(`Got an error fetching contacts from Hubspot, cannot complete Action: ${JSON.stringify(response.data, null, 2)}`);
            }
        }

        this.logger.info(`Contacts download complete, returning ${hubspotContacts.length} contacts.`);

        return hubspotContacts;
    }
}

export { HubspotContactsAction };
