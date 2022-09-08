const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('raw_objects', function (table) {
            table.increments('id');
            table.timestamps(true, true);
            table.json('raw');
            table.integer('connection_id').references('id').inTable('connections');
            table.string('object_type').notNullable();
        })
        .then(() => knex.raw(onUpdateTrigger('raw_objects')));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('raw_objects');
};
