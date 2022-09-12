import knex from 'knex';
import type { Knex } from 'knex';
import { config } from '../../db/config.js';

class KnexDatabase {
    knex: Knex;

    constructor() {
        let env = process.env['NODE_ENV'];
        if (env == null || !['development', 'production'].includes(env)) {
            process.exit(1);
        }

        let knexConfig = env === 'development' ? config.development : config.production;
        this.knex = knex(knexConfig);
    }
}

export default new KnexDatabase();
