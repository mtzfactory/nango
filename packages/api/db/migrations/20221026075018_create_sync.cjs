const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex, _) {
    return knex.schema
        .createTable('syncs', function (table) {
            table.increments('id').primary();
            table.timestamps(true, true);
            table.string('url').notNullable();
            table.string('method').notNullable();
            table.json('headers');
            table.json('body');
            table.string('unique_key');
            table.string('response_path');
            table.string('paging_request_path');
            table.string('paging_response_path');
        })
        .then(() => knex.raw(onUpdateTrigger('syncs')));
};

exports.down = function (knex, _) {
    return knex.schema.dropTable('syncs');
};
