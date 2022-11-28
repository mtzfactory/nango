import './config.js';
import express from 'express';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { db } from '@nangohq/core';
import syncsController from './syncs.controller.js';
import syncsMiddleware from './syncs.middleware.js';
import syncsClient from './syncs.client.js';

await db.knex.raw(`CREATE SCHEMA IF NOT EXISTS ${db.schema()}`);
await db.migrate(process.env['NANGO_DB_MIGRATION_FOLDER'] || '../core/db/migrations');
await syncsClient.connect();

const port = process.env['PORT'] || 3003;
const app = express();

app.use(express.json());
app.use(cors());
app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.json(), winston.format.prettyPrint())
    })
);

app.route(`/v1/syncs`).post(syncsMiddleware.validateCreateSyncRequest, syncsController.createSync);
app.listen(port, () => {
    console.log(`✅ Nango Server is listening on port ${port}.`);
});
