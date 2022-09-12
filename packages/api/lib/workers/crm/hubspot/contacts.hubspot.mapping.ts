import type { RawObject } from '../../../shared/models/raw_object.model.js';
import type { Contact } from '../../../shared/models/contact.model.js';

class HubspotContactsMapping {
    public map(rawContacts: RawObject[], rawContactIds: { id: number }[]): Contact[] {
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

export default new HubspotContactsMapping();
