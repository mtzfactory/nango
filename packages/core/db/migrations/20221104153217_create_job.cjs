exports.up = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).createTable('_nango_jobs', function (table) {
        table.increments('id').primary();
        table.integer('sync_id').references('id').inTable(`${schema}._nango_syncs`);
        table.dateTime('started_at').notNullable();
        table.dateTime('ended_at');
        table.string('status').notNullable();
        table.string('error_message');
        table.integer('total_row_count');
        table.integer('new_row_count');
        table.integer('updated_row_count');
    });
};

exports.down = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).dropTable('_nango_jobs');
};
