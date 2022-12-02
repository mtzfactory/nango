exports.up = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_syncs', function (table) {
        table.string('friendly_name');
        table.json('metadata');
    });
};

exports.down = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_syncs', function (table) {
        table.dropColumn('friendly_name');
        table.dropColumn('metadata');
    });
};
