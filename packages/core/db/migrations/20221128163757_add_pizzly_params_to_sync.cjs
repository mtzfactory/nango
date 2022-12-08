exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_syncs', function (table) {
        table.string('pizzly_connection_id');
        table.string('pizzly_provider_config_key');
    });
};

exports.down = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_syncs', function (table) {
        table.dropColumn('pizzly_connection_id');
        table.dropColumn('pizzly_provider_config_key');
    });
};
