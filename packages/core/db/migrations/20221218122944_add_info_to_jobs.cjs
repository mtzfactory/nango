exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_jobs', function (table) {
        table.integer('added_count');
        table.integer('updated_count');
        table.integer('deleted_count');
        table.integer('unchanged_count');
        table.integer('fetched_count');
        table.integer('page_count');
        table.jsonb('info');
        table.dropColumn('total_row_count');
        table.dropColumn('new_row_count');
        table.dropColumn('updated_row_count');
    });
};

exports.down = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_jobs', function (table) {
        table.dropColumn('added_count');
        table.dropColumn('updated_count');
        table.dropColumn('deleted_count');
        table.dropColumn('unchanged_count');
        table.dropColumn('fetched_count');
        table.dropColumn('pages_count');
        table.dropColumn('info');
        table.integer('total_row_count');
        table.integer('new_row_count');
        table.integer('updated_row_count');
    });
};
