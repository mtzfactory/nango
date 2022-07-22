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
    let registerConnectionPromise = nango.registerConnection(integration, 1, tokens[integration]);
    registerConnectionPromise.catch((errorMsg) => {
        console.log(`Uh oh, got error message on registerConnection: ${errorMsg}`);
    });
}

async function triggerAction(integration, action, input) {
    let result = await nango.triggerAction(integration, action, 1, input);
    logResponse(integration, action, result);
}

async function loadSample(sample) {
    try {
        await registerConnection(sample.integration);
        await triggerAction(sample.integration, sample.action, sample.input);
    } catch (e) {
        console.log(e);
    }
}

/** -------------------- Execution -------------------- */

const nango = new Nango('localhost');
await nango.connect();

const tokens = yaml.load(fs.readFileSync('.dev-tokens.yaml').toString());
const samples = yaml.load(fs.readFileSync('packages/node-client/bin/samples.yaml').toString()).samples;

const sampleName = process.argv[2];

if (typeof sampleName !== 'string' || samples[sampleName] === undefined) {
    console.log('Provided parameter does not correspond to valid sample in packages/node-client/binsamples.yaml.');
} else if (tokens[samples[sampleName].integration] === undefined) {
    console.log('Missing access token for integration. Please edit the .dev-tokens.yaml file in the Nango project root directory.');
} else {
    loadSample(samples[sampleName]);
}

closeConnection();
