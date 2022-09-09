exports.up = function (knex, Promise) {
    return knex.schema.table('connections', function (table) {
        table.string('access_token');
        table.string('account_id').notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.table('connections', function (table) {
        table.dopColumn('access_token');
        table.dopColumn('account_id');
    });
};
