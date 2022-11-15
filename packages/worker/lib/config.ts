import * as dotenv from 'dotenv';
dotenv.config({ path: process.env['NANGO_SERVER_RUN_MODE'] === 'DOCKERIZED' ? '.env' : '../../.env' });
