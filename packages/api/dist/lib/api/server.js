import express from 'express';
import * as http from 'http';
import { ContactsRoutes } from './contacts/contacts.routes.config.js';
import debug from 'debug';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
const port = process.env['PORT'] || 3000;
const app = express();
const server = http.createServer(app);
const routes = [];
const debugLog = debug('app');
app.use(express.json());
app.use(cors());
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true }))
};
if (!process.env['DEBUG']) {
    loggerOptions.meta = false;
}
app.use(expressWinston.logger(loggerOptions));
routes.push(new ContactsRoutes(app));
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (_, res) => {
    res.status(200).send(runningMessage);
});
server.listen(port, () => {
    routes.forEach((route) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
    console.log(runningMessage);
});
//# sourceMappingURL=server.js.map