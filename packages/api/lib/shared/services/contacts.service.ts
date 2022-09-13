import db from '../database.js';
import type { Contact } from '../models/contact.model.js';

class ContactsService {
    async list() {
        return await db.knex<Contact>('contacts').limit(100);
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
