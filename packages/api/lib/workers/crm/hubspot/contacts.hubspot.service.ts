import axios from 'axios';
import type { Connection } from '../../../shared/models/connection.model.js';
import type { RawObject } from '../../../shared/models/raw_object.model.js';

// Docs: https://developers.hubspot.com/docs/api/crm/contacts
class HubspotContactsService {
    async getContacts(connection: Connection, contactProperties: string[], lastSyncAt: Date | null): Promise<any[]> {
        let contacts: any[] = [];
        let done = false;
        let pageCursor = null;
        let maxNumberOfRecords = 10000;
        let lastSyncTs = lastSyncAt == null ? null : lastSyncAt.getTime().toString();

        while (!done) {
            let body = {
                limit: '100',
                properties: contactProperties,
                after: pageCursor
            };

            if (lastSyncTs != null) {
                body['filterGroups'] = [
                    { filters: [{ propertyName: 'createdate', operator: 'GTE', value: lastSyncTs }] }, // Created after last sync.
                    { filters: [{ propertyName: 'lastmodifieddate', operator: 'GTE', value: lastSyncTs }] } // Updated after last sync.
                ];
            }

            let config = this.enrichWithToken({}, connection);

            let res = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts/search', body, config).catch((err) => {
                console.log(err.response.data.message);
            });

            if (res == null) {
                break;
            }

            contacts = contacts.concat(res.data.results);

            if (res.data.paging && contacts.length < maxNumberOfRecords) {
                pageCursor = res.data.paging.next.after;
            } else {
                done = true;
            }
        }

        let rawContacts: RawObject[] = [];

        for (var contact of contacts) {
            rawContacts.push({
                raw: contact,
                connection_id: 1,
                object_type: 'contact'
            });
        }

        return rawContacts;
    }

    async getContactProperties(connection: Connection): Promise<string[]> {
        let config = this.enrichWithToken({}, connection);

        let res = await axios.get('https://api.hubapi.com/crm/v3/properties/contacts', config).catch((err) => {
            console.log(err.response.data.message);
        });

        let contactProperties: string[] = [];

        if (res != null) {
            for (const field of res.data.results) {
                if (field.groupName === 'contactinformation') {
                    contactProperties.push(field.name);
                }
            }
        }

        return contactProperties;
    }

    enrichWithToken(config: any, connection: Connection) {
        if (config == null) {
            config = { headers: {} };
        }

        if (!('headers' in config)) {
            config['headers'] = {};
        }

        config['headers']['authorization'] = `Bearer ${connection.access_token}`;
        return config;
    }
}

export default new HubspotContactsService();
