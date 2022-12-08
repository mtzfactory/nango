exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_raw', function (table) {
        table.json('metadata');
    });
};

exports.down = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_raw', function (table) {
        table.dropColumn('metadata');
    });
};
