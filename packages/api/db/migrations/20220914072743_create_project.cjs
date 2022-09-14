const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('projects', function (table) {
            table.increments('id').primary();
            table.timestamps(true, true);
            table.string('token');
        })
        .then(() => knex.raw(onUpdateTrigger('projects')));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('projects');
};
