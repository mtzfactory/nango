import type { Knex } from 'knex';

let config: { development: Knex.Config<any>; production: Knex.Config<any>; onUpdateTrigger: any } = {
    development: {
        client: 'pg',
        connection: {
            host: 'localhost',
            port: 5432,
            user: 'bb',
            database: 'bb'
        },
        migrations: {
            directory: './migrations',
            extension: 'ts'
        }
    },

    production: {
        client: 'pg',
        connection: {
            connectionString: process.env['DATABASE_URL'] || '',
            ssl: {
                rejectUnauthorized: false
            }
        },
        migrations: {
            directory: './migrations',
            extension: 'ts'
        }
    },

    onUpdateTrigger: (table: Knex.Table) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `
};

export { config };
