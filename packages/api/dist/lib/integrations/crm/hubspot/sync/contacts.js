import axios from 'axios';
class HubspotContactsSync {
    async sync() {
        var config = this.enrichWithToken({});
        let res = await axios.get('https://api.hubapi.com/crm/v3/properties/contacts', config).catch((err) => {
            console.log(err.response.data.message);
        });
        if (res == null) {
            return;
        }
        let contactProperties = [];
        for (const field of res.data.results) {
            if (field.groupName === 'contactinformation') {
                contactProperties.push(field.name);
            }
        }
        let hubspotContacts = [];
        let done = false;
        let pageCursor = null;
        let maxNumberOfRecords = 20;
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
                return;
            }
            hubspotContacts = hubspotContacts.concat(res.data.results);
            if (res.data.paging && hubspotContacts.length < maxNumberOfRecords) {
                pageCursor = res.data.paging.next.after;
            }
            else {
                done = true;
            }
        }
        console.log(`Contacts download complete, returning ${hubspotContacts.length} contacts.`);
        console.log(hubspotContacts);
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