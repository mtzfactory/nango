const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('connections', function (table) {
            table.increments('id');
            table.timestamps(true, true);
            table.string('integration_type').notNullable();
        })
        .then(() => knex.raw(onUpdateTrigger('connections')));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('connections');
};
