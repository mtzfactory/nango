import { NangoConfig, NangoIntegrationsConfig, NangoLoadConfigMessage, NangoMessage, NangoMessageAction } from './nango-types.js'; 
import * as fs from 'fs'
import * as path from 'path'
import {Channel, connect, ConsumeMessage} from 'amqplib'
import * as yaml from 'js-yaml'

let inboundRabbitChannel: Channel;

// Reset & setup of server-owned location for nango-integrations
// Should be moved to an env variable
const serverIntegrationsRootDir = '/tmp/nango-integrations-server';
const serverNangoIntegrationsDir = path.join(serverIntegrationsRootDir, 'nango-integrations');
fs.rmSync(serverIntegrationsRootDir, {recursive: true, force: true});
fs.mkdirSync(serverIntegrationsRootDir);

// Server owned copies of nango-config.yaml and integrations.yaml for later reference
let nangoConfig: NangoConfig;
let loadedIntegrations: NangoIntegrationsConfig;

async function handleInboundMessage(msg: ConsumeMessage | null) {
    if (msg === null) {
        return; // Skipp non-existing messages (honestly no idea why we might get null here but supposedly it can happen)
    }

    const nangoMessage = JSON.parse(msg.content.toString()) as NangoMessage;

    console.log(`Server received message:\n${msg.content.toString()}`);

    let result = null;
    switch(nangoMessage.action) {
        case NangoMessageAction.LOAD_CONFIG:
            const configMessage = nangoMessage as NangoLoadConfigMessage;            
            handleLoadConfig(configMessage);
            break;
        
        // case NangoMessageAction.TRIGGER_ACTION:
        //     const triggerMessage = nangoMessage as NangoTriggerActionMessage;
        //     result = await handleTriggerAction(triggerMessage);
        //     break;
        
        default:
            throw new Error(`Received inbound server message with unknown action: ${nangoMessage.action}`);
    }

    if (result !== null) {
        // Send response back to client
    }

    inboundRabbitChannel.ack(msg);
}

// - Stores copy of passed in nango-config.yaml for later reference
// - Copies nango-integrations-compiled folder into a server-owned location
// - Reads integrations.yaml and stores it for later reference
function handleLoadConfig(configMsg: NangoLoadConfigMessage) {
    // - Stores copy of passed in nango-config.yaml for later reference
    nangoConfig = configMsg.config;

    // - Copies nango-integrations folder into a server-owned location
    fs.cpSync(nangoConfig.nango_integrations_dir, serverIntegrationsRootDir, {recursive: true}); // TODO: Rework this, it is an experimental feature of node >16.7

    // - Reads integrations.yaml and stores it for later reference
    loadedIntegrations = yaml.load(fs.readFileSync(path.join(serverNangoIntegrationsDir, 'integrations.yaml')).toString()) as NangoIntegrationsConfig;
    console.log(`Loaded integrations:\n${JSON.stringify(loadedIntegrations)}`);
}

// async function handleTriggerAction(nangoMsg: NangoTriggerActionMessage) {

// }

async function connectRabbit() {
    const inboundSeverQueue = 'server_inbound';
    const rabbitConnection = await connect('amqp://localhost');

    const rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertQueue(inboundSeverQueue);

    rabbitChannel.consume(inboundSeverQueue, handleInboundMessage);

    return rabbitChannel
}

// Alright, let's run!
inboundRabbitChannel = await connectRabbit();