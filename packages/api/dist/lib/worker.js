import knex from 'knex';
// import { HubspotContactsSync } from './integrations/crm/hubspot/sync/contacts.js';
// let contactsSync = new HubspotContactsSync();
// contactsSync.sync();
let db = knex({
    client: 'pg',
    connection: process.env['DATABASE_URL'] || 'postgres://localhost',
    migrations: {
        directory: '../migrations'
    }
});
let results = await db.select(['*']).from('raw_objects').limit(10);
console.log(results);
db.destroy();
//# sourceMappingURL=worker.js.map