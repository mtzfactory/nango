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
    },

    onUpdateTrigger: (table) => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `
};
