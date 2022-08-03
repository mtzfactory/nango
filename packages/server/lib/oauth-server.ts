import express from 'express';
import session from 'express-session';
import sqlLiteStore from 'better-sqlite3-session-store';
import dbConstructor from 'better-sqlite3';
import * as path from 'path';
import { IntegrationsManager } from './integrations-manager.js';

const app = express();

const sqlLiteSessionStore = sqlLiteStore(session);

export function startOAuthServer(serverWorkingDir: string) {
    const port = IntegrationsManager.getInstance().getNangoConfig().oauth_server_port;

    const sessionDbPath = path.join(serverWorkingDir, 'http-sessions.db');
    const sessionsDb = new dbConstructor(sessionDbPath);

    let sessionConfig = {
        store: new sqlLiteSessionStore({
            client: sessionsDb,
            expired: {
                clear: true,
                intervalMs: 900000 //ms = 15min
            }
        }),
        secret: process.env['NANGO_SERVER_OAUTH_COOKIE_SECRET'] || 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false
        }
    };

    if (process.env['NODE_ENV'] === 'production') {
        app.set('trust proxy', 1); // trust first proxy
        sessionConfig.cookie.secure = true; // serve secure cookies
    }

    app.use(session(sessionConfig));

    app.listen(port);
}
