const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('syncs', function (table) {
            table.increments('id');
            table.timestamps(true, true);
            table.integer('connection_id').references('id').inTable('connections');
            table.dateTime('sync_at');
            table.string('type');
        })
        .then(() => knex.raw(onUpdateTrigger('syncs')));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('syncs');
};
