exports.up = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_jobs', function (table) {
        table.text('error_message').alter({ alterType: true });
    });
};

exports.down = function (knex, _) {
    return knex.schema.withSchema('nango').alterTable('_nango_jobs', function (table) {
        table.string('error_message').alter({ alterType: true });
    });
};
