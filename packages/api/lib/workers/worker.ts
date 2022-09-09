import { HubspotContactsSync } from './integrations/crm/hubspot/sync/contacts.js';
import knex from 'knex';
import { config } from '../../db/config.js';
import type { Connection } from '../api/crm/v1/connections/connection.js';

let env = process.env['NODE_ENV'];
if (env == null || !['development', 'production'].includes(env)) {
    process.exit(1);
}

let knexConfig = env === 'development' ? config.development : config.production;
let db = knex(knexConfig);

let result = await db('connections').where({ account_id: 'b511d281-bb8b-438a-90df-e5cfcd16f3f2' });

if (result == null || result.length != 1) {
    process.exit(1);
}

let connection: Connection = result[0];

let contactsSync = new HubspotContactsSync(connection);
await contactsSync.sync(db);

db.destroy();
