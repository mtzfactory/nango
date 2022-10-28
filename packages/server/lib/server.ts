import express from 'express';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { syncsQueue, db } from '@nangohq/core';
import SyncsController from './v1/syncs/syncs.controller.js';
import SyncsMiddleware from './v1/syncs/syncs.middleware.js';

const port = process.env['PORT'] || 3003;

const app = express();

app.use(express.json());
app.use(cors());

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.json(), winston.format.prettyPrint())
    })
);

app.route(`/v1/syncs`).post(SyncsMiddleware.validateCreateSyncRequest, SyncsController.createSync);

app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.json(), winston.format.prettyPrint())
    })
);

db.migrate(process.env['NANGO_DB_MIGRATION_FOLDER'] || '../core/db/migrations')
    .then(() => {
        syncsQueue
            .connect()
            .then(() => {
                app.listen(port, () => {
                    console.log(`✅ Nango Server is listening on port ${port}.`);
                });
            })
            .catch((error) => {
                console.log(`❌ Could connect to RabbitMQ: ${error}\n`);
            });
    })
    .catch((error) => {
        console.log(`❌ Could connect to DB or execute schema migration: ${error}`);
    });
