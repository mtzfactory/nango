exports.up = function (knex, Promise) {
    return knex.schema.createTable('connections', function (table) {
        table.increments('id');
        table.timestamps();
        table.string('integration_type').notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('connections');
};
