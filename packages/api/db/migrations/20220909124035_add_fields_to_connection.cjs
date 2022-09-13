exports.up = function (knex, Promise) {
    return knex.schema.table('connections', function (table) {
        table.string('access_token');
        table.string('account_id').notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('connections', function (table) {
        table.dropColumn('access_token');
        table.dropColumn('account_id');
    });
};
