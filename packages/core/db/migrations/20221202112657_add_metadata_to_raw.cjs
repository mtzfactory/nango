exports.up = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_raw', function (table) {
        table.json('metadata');
    });
};

exports.down = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_raw', function (table) {
        table.dropColumn('metadata');
    });
};
