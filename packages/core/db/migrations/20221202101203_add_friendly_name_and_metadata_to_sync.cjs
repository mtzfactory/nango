exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_syncs', function (table) {
        table.string('friendly_name');
        table.json('metadata');
    });
};

exports.down = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_syncs', function (table) {
        table.dropColumn('friendly_name');
        table.dropColumn('metadata');
    });
};
