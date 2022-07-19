import {
  NangoConfig,
  NangoIntegrationsConfig,
  NangoMessage,
  NangoMessageAction,
  NangoRegisterConnectionMessage,
  NangoTriggerActionMessage
} from '@nangohq/core';
import * as core from '@nangohq/core';
import * as fs from 'fs';
import * as path from 'path';
import { connect, ConsumeMessage, Channel } from 'amqplib';
import * as yaml from 'js-yaml';
import type winston from 'winston';
import { ConnectionsManager } from './connections.js';

/** -------------------- Server Internal Properties -------------------- */

const inboundSeverQueue = 'server_inbound';
const outboundSeverQueue = 'server_outbound';
let inboundRabbitChannel: Channel | null = null;
let outboundRabbitChannel: Channel | null = null;

let logger: winston.Logger;
let connectionsManager: ConnectionsManager;

// Server owned copies of nango-config.yaml and integrations.yaml for later reference
let nangoConfig: NangoConfig;
let loadedIntegrations: NangoIntegrationsConfig;

// Should be moved to an env variable
const serverIntegrationsRootDir = '/tmp/nango-integrations-server';
const serverNangoIntegrationsDir = path.join(
  serverIntegrationsRootDir,
  'nango-integrations'
);
fs.rmSync(serverIntegrationsRootDir, { recursive: true, force: true });
fs.mkdirSync(serverIntegrationsRootDir);
fs.cpSync(
  'node_modules',
  path.join(serverIntegrationsRootDir, 'node_modules'),
  { recursive: true }
); // yes this is incredibly hacky. Will be fixed with proper packages setup

/** -------------------- Inbound message handling -------------------- */

async function handleInboundMessage(msg: ConsumeMessage | null) {
  if (msg === null) {
    return; // Skipp non-existing messages (honestly no idea why we might get null here but supposedly it can happen)
  }

  const nangoMessage = JSON.parse(msg.content.toString()) as NangoMessage;

  logger.debug(`Server received message:\n${msg.content.toString()}`);

  let result = null;
  switch (nangoMessage.action) {
    case NangoMessageAction.REGISTER_CONNECTION: {
      const registerMessage = nangoMessage as NangoRegisterConnectionMessage;
      handleRegisterConnection(registerMessage);
      break;
    }
    case NangoMessageAction.TRIGGER_ACTION: {
      const triggerMessage = nangoMessage as NangoTriggerActionMessage;
      result = await handleTriggerAction(triggerMessage);

      outboundRabbitChannel?.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify(result), 'utf8'),
        {
          correlationId: msg.properties.correlationId
        }
      );

      break;
    }
    default: {
      throw new Error(
        `Received inbound server message with unknown action: ${nangoMessage.action}`
      );
    }
  }

  if (result !== null) {
    // Send response back to client
  }

  inboundRabbitChannel?.ack(msg);
}

function bootstrapServer() {
  if (!process.env['NANGO_INTEGRATIONS_PACKAGE_DIR']) {
    throw new Error(
      `Fatal server error, cannot bootstrap: NANGO_INTEGRATIONS_PACKAGE_DIR is not set.`
    );
  }

  // - Copies nango-integrations folder into a server-owned location
  const nangoIntegrationsPackagePath =
    process.env['NANGO_INTEGRATIONS_PACKAGE_DIR'];

  fs.cpSync(nangoIntegrationsPackagePath, serverIntegrationsRootDir, {
    recursive: true
  }); // TODO: Rework this, it is an experimental feature of node >16.7

  // Read nango-config.yaml
  nangoConfig = yaml.load(
    fs
      .readFileSync(path.join(serverNangoIntegrationsDir, 'nango-config.yaml'))
      .toString()
  ) as NangoConfig;

  // - Reads integrations.yaml and stores it for later reference
  loadedIntegrations = yaml.load(
    fs
      .readFileSync(path.join(serverNangoIntegrationsDir, 'integrations.yaml'))
      .toString()
  ) as NangoIntegrationsConfig;

  // Setup connectionsManager
  connectionsManager = new ConnectionsManager(
    path.join(serverIntegrationsRootDir, 'server.db')
  );

  // Must happen once config is loaded as it contains the log level
  logger = core.getLogger(
    nangoConfig.main_server_log_level,
    core.nangoServerLogFormat,
    core.getServerLogFilePath(serverIntegrationsRootDir)
  );

  logger.info('Server ready!');
}

function handleRegisterConnection(nangoMsg: NangoRegisterConnectionMessage) {
  // Check if the connection already exists
  const connection = connectionsManager.getConnection(
    nangoMsg.userId,
    nangoMsg.integration
  );
  if (connection !== undefined) {
    logger.warn(
      `Attempt to register an already-existing connection (integration: ${nangoMsg.integration}, user_id: ${nangoMsg.userId})`
    );
    return;
  }

  connectionsManager.registerConnection(
    nangoMsg.userId,
    nangoMsg.integration,
    nangoMsg.oAuthAccessToken,
    nangoMsg.additionalConfig
  );
}

async function handleTriggerAction(nangoMsg: NangoTriggerActionMessage) {
  // Check if the integration exists
  let integrationConfig = null;
  for (const integration of loadedIntegrations.integrations) {
    const integrationName = Object.keys(integration)[0];
    if (integrationName === nangoMsg.integration) {
      integrationConfig = integration[integrationName];
    }
  }

  if (integrationConfig === null) {
    throw new Error(
      `Tried to trigger an action for an integration that does not exist: ${nangoMsg.integration}`
    );
  }

  // Check if the connection exists
  const connection = connectionsManager.getConnection(
    nangoMsg.userId,
    nangoMsg.integration
  );
  if (connection === undefined) {
    throw new Error(
      `Tried to trigger action '${nangoMsg.triggeredAction}' for integration '${nangoMsg.integration}' with user_id '${nangoMsg.userId}' but no connection exists for this user_id and integration`
    );
  }

  // Check if the action (file) exists
  const actionFilePath = path.join(
    path.join(serverNangoIntegrationsDir, nangoMsg.integration),
    nangoMsg.triggeredAction + '.action.js'
  );
  if (!fs.existsSync(actionFilePath)) {
    throw new Error(
      `Tried to trigger action '${nangoMsg.triggeredAction}' for integration '${nangoMsg.integration}' but the action file at '${actionFilePath}' does not exist`
    );
  }

  // Load the JS file and execute the action
  const actionModule = await import(actionFilePath);
  const key = Object.keys(actionModule)[0] as string;
  const actionInstance = new actionModule[key](
    nangoConfig,
    integrationConfig,
    connection,
    serverIntegrationsRootDir,
    nangoMsg.triggeredAction
  );
  const result = await actionInstance.executeAction(nangoMsg.input);
  actionInstance.markExecutionComplete();
  logger.debug(`Result from action: ${JSON.stringify(result)}`);

  return result;
}

async function connectRabbit() {
  const rabbitConnection = await connect('amqp://localhost');

  inboundRabbitChannel = await rabbitConnection.createChannel();
  await inboundRabbitChannel.assertQueue(inboundSeverQueue);

  inboundRabbitChannel.consume(inboundSeverQueue, handleInboundMessage);

  outboundRabbitChannel = await rabbitConnection.createChannel();
  await outboundRabbitChannel.assertQueue(outboundSeverQueue);
}

// Alright, let's run!
bootstrapServer(); // Must happen before we start to process messages
connectRabbit();
