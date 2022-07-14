import { NangoConfig, NangoConnection, NangoIntegrationsConfig, NangoLoadConfigMessage, NangoMessage, NangoMessageAction, NangoRegisterConnectionMessage, NangoTriggerActionMessage } from './nango-types.mjs'; 
import * as fs from 'fs'
import * as path from 'path'
import { Channel, connect, ConsumeMessage } from 'amqplib'
import * as yaml from 'js-yaml'
import * as uuid from 'uuid'
import DatabaseConstructor from 'better-sqlite3'

/** -------------------- Server Internal Properties -------------------- */

const inboundSeverQueue = 'server_inbound';
let inboundRabbitChannel: Channel;

// Server owned copies of nango-config.yaml and integrations.yaml for later reference
let nangoConfig: NangoConfig;
let loadedIntegrations: NangoIntegrationsConfig;

// Should be moved to an env variable
const serverIntegrationsRootDir = '/tmp/nango-integrations-server';
const serverNangoIntegrationsDir = path.join(serverIntegrationsRootDir, 'nango-integrations');
fs.rmSync(serverIntegrationsRootDir, {recursive: true, force: true});
fs.mkdirSync(serverIntegrationsRootDir);
fs.cpSync('node_modules', path.join(serverIntegrationsRootDir, 'node_modules'), {recursive: true});

// Prepare SQLLite DB
let db = new DatabaseConstructor(path.join(serverIntegrationsRootDir, 'sqlite.db'));
db.exec(`
CREATE TABLE nango_connections (
    uuid VARCHAR(36) NOT NULL,
    integration TEXT NOT NULL,
    user_id TEXT NOT NULL,
    oauth_access_token TEXT NOT NULL,
    additional_config TEXT,
    datecreated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    lastmodified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
PRIMARY KEY (uuid),
UNIQUE (integration, user_id)
);

CREATE TRIGGER update_lastmodified_nango_connections
AFTER UPDATE On nango_connections
BEGIN
    UPDATE nango_connections SET lastmodiefied = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE uuid = NEW.uuid;
END;
`);

/** -------------------- Inbound message handling -------------------- */

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

        case NangoMessageAction.REGISTER_CONNECTION:
            const registerMessage = nangoMessage as NangoRegisterConnectionMessage;
            handleRegisterConnection(registerMessage);
            break;
        
        case NangoMessageAction.TRIGGER_ACTION:
            const triggerMessage = nangoMessage as NangoTriggerActionMessage;
            result = await handleTriggerAction(triggerMessage);
            break;
        
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
    nangoConfig = configMsg.config;

    // - Copies nango-integrations folder into a server-owned location
    fs.cpSync(nangoConfig.nango_integrations_pkg_path, serverIntegrationsRootDir, {recursive: true}); // TODO: Rework this, it is an experimental feature of node >16.7

    // - Reads integrations.yaml and stores it for later reference
    loadedIntegrations = yaml.load(fs.readFileSync(path.join(serverNangoIntegrationsDir, 'integrations.yaml')).toString()) as NangoIntegrationsConfig;
    console.log(`Loaded integrations:\n${JSON.stringify(loadedIntegrations)}`);
}

function handleRegisterConnection(nangoMsg: NangoRegisterConnectionMessage) {

    // Check if the connection already exists
    const dbRes = db.prepare('SELECT uuid FROM nango_connections WHERE integration = ? AND user_id = ?').all([nangoMsg.integration, nangoMsg.userId]);
    if (dbRes.length > 0) {
        throw new Error(`Cannot register connection, connection for itegration '${nangoMsg.integration}' and user_id '${nangoMsg.userId}' already exists`);
    }

    db.prepare(`
        INSERT INTO nango_connections
        (uuid, integration, user_id, oauth_access_token, additional_config)
        VALUES (?, ?, ?, ?, ?)
    `).run(uuid.v4(), nangoMsg.integration, nangoMsg.userId, nangoMsg.oAuthAccessToken, JSON.stringify(nangoMsg.additionalConfig));
}

async function handleTriggerAction(nangoMsg: NangoTriggerActionMessage) {

    // Check if the integration exists
    let integrationConfig = null;
    for (let integration of loadedIntegrations.integrations) {
        const integrationName = Object.keys(integration)[0];
        if (integrationName === nangoMsg.integration) {
            integrationConfig = integration[integrationName];
        }
    }

    if (integrationConfig === null) {
        throw new Error(`Tried to trigger an action for an integration that does not exist: ${nangoMsg.integration}`);
    }

    // Check if the connection exists
    const connection = db.prepare('SELECT * FROM nango_connections WHERE integration = ? AND user_id = ?').get(nangoMsg.integration, nangoMsg.userId);
    if (connection === null) {
        throw new Error(`Tried to trigger action '${nangoMsg.triggeredAction}' for integration '${nangoMsg.integration}' with user_id '${nangoMsg.userId}' but no connection exists for this user_id and integration`);
    }
    const connectionObject = {
        uuid: connection.uuid,
        integration: connection.integration,
        userId: connection.user_id,
        oAuthAccessToken: connection.oauth_access_token,
        additionalConfig: JSON.parse(connection.additional_config)
    } as NangoConnection;

    // Check if the action (file) exists
    const actionFilePath = path.join(path.join(serverNangoIntegrationsDir, nangoMsg.integration), nangoMsg.triggeredAction + '.action.mjs');
    if (!fs.existsSync(actionFilePath)) {
        throw new Error(`Tried to trigger action '${nangoMsg.triggeredAction}' for integration '${nangoMsg.integration}' but the action file at '${actionFilePath}' does not exist`);
    }

    // Load the JS file and execute the action
    const actionModule = await import(actionFilePath);
    const key = Object.keys(actionModule)[0] as string;
    const actionInstance = new actionModule[key](integrationConfig, connectionObject);
    let result = await actionInstance.executeAction(nangoMsg.input);
    console.log(`Result from action: ${result}`);

    return result;
}

async function connectRabbit() {
    const rabbitConnection = await connect('amqp://localhost');

    const rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertQueue(inboundSeverQueue);

    rabbitChannel.consume(inboundSeverQueue, handleInboundMessage);

    return rabbitChannel
}

// Alright, let's run!
inboundRabbitChannel = await connectRabbit();