/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import Nango from '../dist/nango.js';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

/** -------------------- Utils -------------------- */

function logResponse(integration, action, response) {
    console.log(`${integration}.${action} response: ${response.status} - ${response.statusText}`);
}

function closeConnection() {
    setTimeout(function () {
        nango.close();
        process.exit(0);
    }, 1000);
}

async function registerConnection(integration) {
    await nango.registerConnection(integration, 1, tokens[integration]).catch((errorMsg) => {
        console.log(`Uh oh, got error message on registerConnection: ${errorMsg}`);
    });
}

async function triggerAction(integration, action, input) {
    let result = await nango.triggerAction(integration, action, 1, input).catch((errorMsg) => {
        console.log(`Uh oh, got error message on triggerAction: ${errorMsg}`);
    });
    logResponse(integration, action, result);
}

async function loadSample(sample) {
    await registerConnection(sample.integration);
    await triggerAction(sample.integration, sample.action, sample.input);
}

/** -------------------- Execution -------------------- */

const nango = new Nango();
await nango.connect();

const tokens = {
    slack: process.env.SLACK_ACCESS_TOKEN,
    github: process.env.GITHUB_ACCESS_TOKEN,
    asana: process.env.ASANA_ACCESS_TOKEN,
    hubspot: process.env.HUBSPOT_ACCESS_TOKEN
};
const samples = yaml.load(fs.readFileSync('packages/node-client/bin/samples.yaml').toString()).samples;

const sampleName = process.argv[2];

if (typeof sampleName !== 'string' || samples[sampleName] === undefined) {
    console.log(`Provided parameter "${sampleName}" does not correspond to valid sample in packages/node-client/bin/samples.yaml.`);
} else if (tokens[samples[sampleName].integration] === undefined) {
    console.log('Missing access token for integration. Please edit the .dev-secrets file in the Nango project root directory.');
} else {
    await loadSample(samples[sampleName]);
}

closeConnection();
