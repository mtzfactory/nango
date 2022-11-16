exports.up = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_syncs', function (table) {
        table.integer('frequency');
    });
};

exports.down = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_syncs', function (table) {
        table.dropColumn('frequency');
    });
};
