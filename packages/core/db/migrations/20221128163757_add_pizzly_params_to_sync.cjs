exports.up = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_syncs', function (table) {
        table.string('pizzly_connection_id');
        table.string('pizzly_provider_config_key');
    });
};

exports.down = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_syncs', function (table) {
        table.dropColumn('pizzly_connection_id');
        table.dropColumn('pizzly_provider_config_key');
    });
};
