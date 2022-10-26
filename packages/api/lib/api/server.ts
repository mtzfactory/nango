import express from 'express';
import * as http from 'http';
import type { CommonRoutesConfig } from './v1/common/common.routes.config';
import { SyncsRoutes } from './v1/syncs/syncs.routes.config.js';
import debug from 'debug';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import syncsQueue from '../shared/queues/syncs.queue.js';

const port = process.env['PORT'] || 3000;

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

app.use(express.json());
app.use(cors());

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true }))
};

if (!process.env['DEBUG']) {
    loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));
routes.push(new SyncsRoutes(app));

const runningMessage = `Server running on port: ${port}`;
app.get('/', (_: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage);
});

server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });

    console.log(runningMessage);
});

await syncsQueue.connect();
