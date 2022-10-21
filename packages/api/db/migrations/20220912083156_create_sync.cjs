const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('syncs', function (table) {
            table.increments('id').primary();
            table.timestamps(true, true);
            table.string('url').notNullable();
            table.json('headers');
            table.json('body');
            table.string('unique_key').notNullable();
            table.string('response_path');
        })
        .then(() => knex.raw(onUpdateTrigger('syncs')));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('syncs');
};
