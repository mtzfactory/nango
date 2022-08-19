/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAction } from '@nangohq/action';

class HubspotAddContactNoteAction extends NangoAction {

    // This Action creates a new note in Hubspot and associates it with the supplied contact
    // It also checks if a Hubspot "ownerEmail" is set for the Connection.
    // If yes, and a Hubspot user exists with this email, then the created note is owned by that Hubspot user
    override async executeAction(input: { contactId: string, note: string, timestamp: string }) {
        this.logger.info(`HubspotAddContactNoteAction has been called with input:\n${JSON.stringify(input, null, 2)}`);

        // Check if all required parameters are present
        if (!input || !input.contactId || !input.note || !input.timestamp) {
            throw new Error(`Missing inputs for 'add-note' action, must pass in contactId (passed: ${input.contactId}), note (passed: ${input.note}) and timestamp (passed: ${input.timestamp})`);
        } 

        // Check if the user has an owner e-mail address set on this Nango Connection
        // To learn more about config stored on Nango Connections check this guide: https://docs.nango.dev/guides/user-connections
        let ownerId = '';
        const userConnection = this.getCurrentConnectionConfig();
        if (userConnection.additionalConfig && userConnection.additionalConfig.ownerEmail) {
            // Query hubspot to turn the owner e-mail into an owner id
            // Check API docs for details: https://developers.hubspot.com/docs/api/crm/owners
            const params = {
                email: userConnection.additionalConfig.ownerEmail as string
            };
            const response = await this.httpRequest('/crm/v3/owners/', 'GET', params);
            if (response.status === 200) {
                if (response.json && response.json.results && response.json.results.length > 0) {
                    ownerId = response.json.results[0].id;
                } else {
                    this.logger.warn(`Could not find an owner in Hubspot that matches the email "${userConnection.additionalConfig.ownerEmail}". Will create note without owner.`);
                }
            } else {
                this.logger.warn(`There was an error fetching owner information, will create note without owner. Response: ${response.data}`);
            }
        }

        // Let's create the note in Hubspot
        // For details check the Hubspot API docs: https://developers.hubspot.com/docs/api/crm/notes
        const body = {
            properties: {
                hs_timestamp: input.timestamp,
                hubspot_owner_id: ownerId,
                hs_note_body: input.note
            }
        };
        const response = await this.httpRequest('/crm/v3/objects/notes', 'POST', undefined, body);
        if (response.status === 201) {
            const noteId = response.json.id;

            // Note was created, now we need associate it with the contact.
            // For details check the Hubspot API docs: https://developers.hubspot.com/docs/api/crm/notes#associate-notes-with-records
            // 202 is the default association type present in all Hubspot instances, so this is what we use here
            const associationResponse = await this.httpRequest(`/crm/v3/objects/notes/${noteId}/associations/contact/${input.contactId}/202`, 'PUT');

            if (associationResponse.status === 200) {
                // Great success, we are done here
                return;
            } else {
                throw new Error(`Successfully created note with id "${noteId}" in Hubspot but association with contact id "${input.contactId}" failed. Server returned: ${associationResponse.data}`);
            }

        } else {
            throw new Error(`There was a problem creating the note in Hubspot, the server returned: ${response.data}`);
        }

    }
}

export { HubspotAddContactNoteAction };
