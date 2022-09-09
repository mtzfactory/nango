import db from '../common/database.js';
import type { Connection } from './connection.js';

class ConnectionsService {
    async readById(accountId: string): Promise<Connection | null> {
        let result = await db.knex('connections').where({ account_id: accountId });

        if (result == null || result.length != 1) {
            return null;
        } else {
            return result[0];
        }
    }
}

export default new ConnectionsService();
