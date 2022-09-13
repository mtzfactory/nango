import db from '../database.js';
import type { Contact } from '../models/contact.model.js';
import type { ListContactsParams } from '../../api/crm/v1/contacts/contacts.controller.js';

class ContactsService {
    async list(params: ListContactsParams) {
        return await db
            .knex<Contact>('contacts')
            .modify(function (queryBuilder) {
                if (params.account_id != null) {
                    queryBuilder.where('account', params.account_id);
                }

                if (params.external_id != null) {
                    queryBuilder.where('external_id', params.external_id);
                }

                if (params.modified_after != null) {
                    queryBuilder.where('updated_at', '>=', params.modified_after);
                }

                if (params.modified_before != null) {
                    queryBuilder.where('updated_at', '<', params.modified_before);
                }

                if (params.created_after != null) {
                    queryBuilder.where('created_at', '>=', params.created_after);
                }

                if (params.created_before != null) {
                    queryBuilder.where('created_at', '<', params.created_before);
                }
            })
            .limit(params.page_size == null ? 10 : Math.min(params.page_size, 100));
    }

    public async upsertFromList(contacts: Contact[]): Promise<void | number[]> {
        return db
            .knex<Contact>('contacts')
            .insert(contacts)
            .onConflict('external_id')
            .merge()
            .catch((err) => {
                console.error(`There was an error upserting contacts by external_id:`, err);
            });
    }
}

export default new ContactsService();
