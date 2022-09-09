import axios from 'axios';
import type { Knex } from 'knex';
import type { Contact, RawContact } from '../../../../../models/contact.js';
import type { Connection } from '../../../../../models/connection.js';

class HubspotContactsSync {
    connection: Connection;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    async sync(db: Knex) {
        let contactProperties: string[] = await this.getContactProperties();
        let queryResult = await this.getContacts(contactProperties);
        let rawContacts = this.contactstoRawObjects(queryResult);
        let rawContactIds = await this.persistRawObjects(db, rawContacts);

        if (rawContactIds != null && rawContactIds.length === rawContacts.length) {
            let contacts = this.mapToStandardContacts(rawContacts, rawContactIds);
            await this.persistContacts(db, contacts);
            console.log(contacts[0]);
        }
    }

    async getContacts(contactProperties: string[]): Promise<any[]> {
        let contacts: any[] = [];
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
            } else {
                done = true;
            }
        }

        return contacts;
    }

    async getContactProperties(): Promise<string[]> {
        let config = this.enrichWithToken({});

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

    contactstoRawObjects(contacts: any[]): RawContact[] {
        let rawContacts: RawContact[] = [];

        for (var contact of contacts) {
            rawContacts.push({
                raw: contact,
                connection_id: 1,
                object_type: 'contact'
            });
        }

        return rawContacts;
    }

    persistRawObjects(db: Knex, rawContacts: RawContact[]): Promise<{ id: number }[] | void> {
        return db('raw_objects').insert(rawContacts, ['id']);
    }

    persistContacts(db: Knex, contacts: Contact[]): Promise<void> {
        return db('contacts').insert(contacts);
    }

    enrichWithToken(config: any) {
        if (config == null) {
            config = { headers: {} };
        }

        if (!('headers' in config)) {
            config['headers'] = {};
        }

        config['headers']['authorization'] = `Bearer ${this.connection.access_token}`;
        return config;
    }

    mapToStandardContacts(rawContacts: RawContact[], rawContactIds: { id: number }[]): Contact[] {
        let contacts: Contact[] = [];

        for (let i = 0; i < rawContacts.length; i++) {
            let rawContactId = rawContactIds[i];
            let rawContact = rawContacts[i];

            if (rawContactId != null && rawContact != null) {
                let contact: Contact = {
                    raw_id: rawContactId.id
                };

                contact.external_id = rawContact.raw['id'];
                contact.first_name = rawContact.raw['properties']['firstname'];
                contact.last_name = rawContact.raw['properties']['lastname'];
                contact.job_title = rawContact.raw['properties']['jobtitle'];
                contact.account = rawContact.raw['properties']['associatedcompanyid'];

                let addresses: { address?: string; city?: string; country?: string; zipcode?: string }[] = [];
                let rawAddress = rawContact.raw['properties']['address'];
                let rawCity = rawContact.raw['properties']['city'];
                let rawCountry = rawContact.raw['properties']['country'];
                if (rawAddress != null || rawCity != null || rawCountry != null) {
                    addresses.push({
                        address: rawAddress,
                        city: rawCity,
                        country: rawCountry
                    });
                }
                contact.addresses = JSON.stringify(addresses);

                let emails: { email: string }[] = [];
                let rawEmail = rawContact.raw['properties']['email'];
                if (rawEmail != null) {
                    emails.push({
                        email: rawEmail
                    });
                }
                contact.emails = JSON.stringify(emails);

                let phones: { phone: string }[] = [];
                let rawPhone = rawContact.raw['properties']['phone'];
                let rawMobilePhone = rawContact.raw['properties']['mobilephone'];
                if (rawPhone != null) {
                    phones.push({
                        phone: rawPhone
                    });
                }

                if (rawMobilePhone != null) {
                    phones.push({
                        phone: rawMobilePhone
                    });
                }
                contact.phones = JSON.stringify(phones);

                contact.last_activity_at = rawContact.raw['properties']['hs_last_sales_activity_date'];
                contact.external_created_at = rawContact.raw['createdAt'];
                contact.external_modified_at = rawContact.raw['updatedAt'];

                contacts.push(contact);
            }
        }

        return contacts;
    }
}

export { HubspotContactsSync };
