import type { Knex } from 'knex';
declare let config: {
    development: Knex.Config<any>;
    production: Knex.Config<any>;
    onUpdateTrigger: any;
};
export { config };
