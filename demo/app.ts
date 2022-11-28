import express from 'express';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { Nango } from '@nangohq/node-client';
import pgClient from 'pg';
const { Client } = pgClient;

const port = process.env['PORT'] || 3005;
const db = new Client({
    user: 'nango',
    host: 'localhost',
    database: 'nango',
    password: 'nango',
    port: 5432
});
db.connect();

const app = express();

app.use(express.text());
app.use(express.json());
app.use(cors());

app.use(
    expressWinston.logger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.json(), winston.format.prettyPrint())
    })
);

app.use(express.static('static'));

app.use(
    expressWinston.errorLogger({
        transports: [new winston.transports.Console()],
        format: winston.format.combine(winston.format.colorize(), winston.format.json(), winston.format.prettyPrint())
    })
);

// From: https://stackoverflow.com/a/26291352/250880
// Turns JS-object style string into a JSON string
// Known issue: Doesn't work with the value contains a `:`
function JSONize(str) {
    return (
        str
            // wrap keys without quote with valid double quote
            .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                return '"' + $1 + '":';
            })
            // replacing single quote wrapped ones to double quote
            .replace(/'([^']+)'/g, function (_, $1) {
                return '"' + $1 + '"';
            })
    );
}

// Add sync
app.post('/api/addSync', (req, res) => {
    var code = req.body;

    // Pull out the config
    const configRegex = /config\s*=\s*(\{[\S|\s]*\})/gm;
    let configRaw = [...code.matchAll(configRegex)][0][1];
    var json = JSONize(configRaw);
    let nangoConfig = JSON.parse(json);

    // Pull out the URL
    let urlRegex = /new Nango().sync\('(.+)',/gm;
    let url = [...code.matchAll(urlRegex)][0][1];

    if (!url || !nangoConfig) {
        res.status(304).send(`Invalid code snippet, found config=${nangoConfig} and url=${url}`);
    }

    console.log(url);
    console.log(nangoConfig);

    new Nango().sync(url, nangoConfig).then((nangoRes) => {
        res.json(nangoRes.data);
    });
});

// Get syncs
// @ts-ignore
app.get('/api/getSyncs', async (req, res) => {
    let syncs = await db.query('SELECT * FROM _nango_syncs ORDER BY created_at DESC');
    res.json(syncs.rows);
});

// Get synced data
// @ts-ignore
app.get('/api/getData', async (req, res) => {
    let data = await db.query('SELECT * FROM _nango_raw ORDER BY sync_id DESC, id DESC LIMIT 1000');
    res.json(data.rows);
});

app.listen(port, () => {
    console.log(`✅ Demo server running on ${port}.`);
});
