exports.up = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).createTable('_nango_raw', function (table) {
        table.increments('id').primary();
        table.integer('sync_id').references('id').inTable(`${schema}._nango_syncs`);
        table.dateTime('emitted_at').notNullable();
        table.string('unique_key');
        table.json('data').notNullable();
    });
};

exports.down = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).dropTable('_nango_raw');
};
