exports.up = function (knex, _) {
    return knex.schema.createTable('_nango_raw', function (table) {
        table.increments('id').primary();
        table.integer('sync_id').references('id').inTable('_nango_syncs');
        table.dateTime('emitted_at').notNullable();
        table.string('unique_key');
        table.json('data').notNullable();
    });
};

exports.down = function (knex, _) {
    return knex.schema.dropTable('_nango_raw');
};
