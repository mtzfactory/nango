exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_syncs', function (table) {
        table.integer('frequency');
    });
};

exports.down = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_syncs', function (table) {
        table.dropColumn('frequency');
    });
};
