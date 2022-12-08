exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').createTable('_nango_jobs', function (table) {
        table.increments('id').primary();
        table.integer('sync_id').references('id').inTable('nango._nango_syncs');
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
    return knex.schema.withSchema('nango').dropTable('_nango_jobs');
};
