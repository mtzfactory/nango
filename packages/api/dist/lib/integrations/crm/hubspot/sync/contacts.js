import axios from 'axios';
import knex from 'knex';
class HubspotContactsSync {
    async sync() {
        let contactProperties = await this.getContactProperties();
        let contacts = await this.getContacts(contactProperties);
        let rawObjects = this.contactstoRawObjects(contacts);
        this.persistRawObjects(rawObjects);
    }
    async getContacts(contactProperties) {
        let contacts = [];
        let done = false;
        let pageCursor = null;
        let maxNumberOfRecords = 20;
        var config = this.enrichWithToken({});
        while (!done) {
            config = {
                params: {
                    limit: '5',
                    properties: contactProperties.join(','),
                    after: pageCursor
                }
            };
            config = this.enrichWithToken(config);
            let res = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', config).catch((err) => {
                console.log(err.response.data.message);
            });
            if (res == null) {
                break;
            }
            contacts = contacts.concat(res.data.results);
            if (res.data.paging && contacts.length < maxNumberOfRecords) {
                pageCursor = res.data.paging.next.after;
            }
            else {
                done = true;
            }
        }
        return contacts;
    }
    async getContactProperties() {
        let config = this.enrichWithToken({});
        let res = await axios.get('https://api.hubapi.com/crm/v3/properties/contacts', config).catch((err) => {
            console.log(err.response.data.message);
        });
        let contactProperties = [];
        if (res != null) {
            for (const field of res.data.results) {
                if (field.groupName === 'contactinformation') {
                    contactProperties.push(field.name);
                }
            }
        }
        return contactProperties;
    }
    contactstoRawObjects(contacts) {
        let raw_objects = [];
        for (var contact of contacts) {
            raw_objects.push({
                raw: contact,
                connection_id: 1,
                object_type: 'contact'
            });
        }
        return raw_objects;
    }
    persistRawObjects(raw_objects) {
        let db = knex({
            client: 'pg',
            connection: process.env['DATABASE_URL'] || 'postgres://localhost'
        });
        db('raw_objects')
            .insert(raw_objects)
            .then(function (_) {
            db.destroy();
        });
    }
    enrichWithToken(config) {
        if (config == null) {
            config = { headers: {} };
        }
        if (!('headers' in config)) {
            config['headers'] = {};
        }
        config['headers']['authorization'] = 'Bearer pat-na1-a633dbdc-d3b4-476f-94e9-03550581e15d';
        return config;
    }
}
export { HubspotContactsSync };
//# sourceMappingURL=contacts.js.map