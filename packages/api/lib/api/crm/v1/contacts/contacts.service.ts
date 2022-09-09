import db from '../common/database.js';

class ContactsService {
    async list() {
        return await db.knex('contacts').limit(100);
    }
}

export default new ContactsService();
