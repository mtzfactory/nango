const { onUpdateTrigger } = require('../knexfile');

exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('contacts', function (table) {
            table.increments('id');
            table.timestamps(true, true);
            table.integer('raw_id').references('id').inTable('raw_objects');
            table.string('external_id');
            table.string('first_name');
            table.string('last_name');
            table.string('job_title');
            table.string('account');
            table.json('addresses');
            table.json('emails');
            table.json('phones');
            table.dateTime('last_activity_at');
            table.dateTime('external_created_at');
            table.dateTime('external_modified_at');
        })
        .then(() => knex.raw(onUpdateTrigger('contacts')));
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('contacts');
};
