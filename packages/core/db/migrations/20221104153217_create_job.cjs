exports.up = function (knex, _) {
    return knex.schema.createTable('_nango_jobs', function (table) {
        table.increments('id').primary();
        table.integer('sync_id').references('id').inTable('_nango_syncs');
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
    return knex.schema.dropTable('_nango_jobs');
};
