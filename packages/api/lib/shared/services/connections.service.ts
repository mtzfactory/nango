import db from '../database.js';
import type { Connection } from '../models/connection.model.js';

class ConnectionsService {
    async readByAccountId(accountId: string): Promise<Connection | null> {
        let result = await db.knex<Connection>('connections').where({ account_id: accountId });

        if (result == null || result.length != 1 || result[0] == null) {
            return null;
        } else {
            return result[0];
        }
    }

    async readById(connectionId: number): Promise<Connection | null> {
        let result = await db.knex<Connection>('connections').where({ id: connectionId });

        if (result == null || result.length != 1 || result[0] == null) {
            return null;
        } else {
            return result[0];
        }
    }
}

export default new ConnectionsService();
