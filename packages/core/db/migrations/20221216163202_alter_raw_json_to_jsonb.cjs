exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_raw', function (table) {
        table.jsonb('data').alter({ alterType: true }).notNullable();
        table.jsonb('metadata').alter({ alterType: true });
    });
};

exports.down = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_raw', function (table) {
        table.json('data').alter({ alterType: true }).notNullable();
        table.json('metadata').alter({ alterType: true });
    });
};
