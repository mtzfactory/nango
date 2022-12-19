exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_raw', function (table) {
        table.dateTime('deleted_at');
        table.string('data_hash').notNullable();
    });
};

exports.down = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_raw', function (table) {
        table.dropColumn('deleted_at');
        table.dropColumn('data_hash');
    });
};
