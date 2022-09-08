exports.up = function (knex, Promise) {
    return knex.schema.createTable('raw_objects', function (table) {
        table.increments('id');
        table.timestamps();
        table.json('raw');
        table.integer('connection_id').references('id').inTable('connections');
        table.string('object_type').notNullable();
    });
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('raw_objects');
};
