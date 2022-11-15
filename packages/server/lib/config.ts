import * as dotenv from 'dotenv';
if (process.env['NANGO_SERVER_RUN_MODE'] !== 'DOCKERIZED') {
    dotenv.config({ path: '../../.env' });
}
