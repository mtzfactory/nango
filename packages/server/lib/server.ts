import express from 'express';
import cors from 'cors';
import { db } from '@nangohq/core';
import syncsController from './syncs.controller.js';
import syncsMiddleware from './syncs.middleware.js';
import SyncClient from './syncs.client.js';
import { authServer, getOauthCallbackUrl } from '@nangohq/auth';
import { getServerPort } from '@nangohq/core';
import testController from './test.controller.js';

await db.knex.raw(`CREATE SCHEMA IF NOT EXISTS ${db.schema()}`);
await db.migrate(process.env['NANGO_DB_MIGRATION_FOLDER'] || '../core/db/migrations');
await SyncClient.connect();

const app = express();

app.use(express.json());
app.use(cors());

app.route(`/v1/syncs`).put(syncsController.editSync);
app.route(`/v1/syncs`).post(syncsMiddleware.validateCreateSyncRequest, syncsController.createSync);

if (process.env['SERVER_RUN_MODE'] !== 'DOCKERIZED') {
    app.route(`/test`).get(testController.test.bind(testController));
}

authServer.setup(app);

const port = getServerPort();
app.listen(port, () => {
    console.log(`✅ Nango Server is listening on port ${port} with OAuth callback URL: ${getOauthCallbackUrl()}.`);
});
