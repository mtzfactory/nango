"use strict";
// Update with your config settings.
module.exports = {
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
        connection: process.env['DATABASE_URL'] || '',
        migrations: {
            directory: './migrations',
            extension: 'ts'
        }
    }
};
//# sourceMappingURL=knexfile.js.map