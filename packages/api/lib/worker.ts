import { HubspotContactsSync } from './integrations/crm/hubspot/sync/contacts.js';
import knex from 'knex';
import { config } from '../db/config.js';

let env = process.env['NODE_ENV'];
if (env == null || !['development', 'production'].includes(env)) {
    process.exit(1);
}

let knexConfig = env === 'development' ? config.development : config.production;
let db = knex(knexConfig);

let contactsSync = new HubspotContactsSync();
await contactsSync.sync(db);

db.destroy();
