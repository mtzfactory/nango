exports.up = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_jobs', function (table) {
        table.string('sync_friendly_name');
        table.text('raw_error');
        table.integer('attempt');
    });
};

exports.down = function (knex, _) {
    var schema = process.env['NANGO_DB_SCHEMA'] || 'nango';
    return knex.schema.withSchema(schema).alterTable('_nango_jobs', function (table) {
        table.dropColumn('sync_friendly_name');
        table.dropColumn('raw_error');
        table.dropColumn('attempt');
    });
};
