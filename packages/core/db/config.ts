import type { Knex } from 'knex';

let config: { development: Knex.Config<any>; production: Knex.Config<any> } = {
    development: {
        client: 'pg',
        connection: {
            host: process.env['NANGO_SERVER_RUN_MODE'] === 'DOCKERIZED' ? process.env['NANGO_DEVELOPMENT_DB_HOST'] || 'nango-db' : 'localhost',
            port: process.env['NANGO_DEVELOPMENT_DB_PORT'] != null ? +process.env['NANGO_DEVELOPMENT_DB_PORT'] : 5432,
            user: process.env['NANGO_DEVELOPMENT_DB_USER'] || 'nango',
            database: process.env['NANGO_DEVELOPMENT_DB_NAME'] || 'nango',
            password: process.env['NANGO_DEVELOPMENT_DB_PASSWORD'] || 'nango'
        },
        migrations: {
            directory: './migrations',
            extension: 'ts'
        }
    },

    production: {}
};

export { config };
