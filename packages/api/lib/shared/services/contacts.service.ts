import db from '../database.js';
import type { Contact } from '../models/contact.model.js';

class ContactsService {
    async list() {
        return await db.knex<Contact>('contacts').limit(100);
    }

    public async createFromList(contacts: Contact[]): Promise<void> {
        return db.knex<Contact>('contacts').insert(contacts);
    }
}

export default new ContactsService();
