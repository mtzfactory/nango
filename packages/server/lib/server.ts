import {
  NangoMessage,
  NangoMessageAction,
  NangoRegisterConnectionMessage,
  NangoTriggerActionMessage
} from '@nangohq/core';
import * as core from '@nangohq/core';
import * as fs from 'fs';
import * as path from 'path';
import { connect, ConsumeMessage, Channel } from 'amqplib';
import type winston from 'winston';
import { ConnectionsManager } from './connections.js';
import { IntegrationsManager } from './nango-integrations.js';

/** -------------------- Server Internal Properties -------------------- */

const inboundSeverQueue = 'server_inbound';
const outboundSeverQueue = 'server_outbound';
let inboundRabbitChannel: Channel | null = null;
let outboundRabbitChannel: Channel | null = null;

let logger: winston.Logger;

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
  const serverRootDir = process.env['NANGO_SERVER_ROOT_DIR'];
  if (serverRootDir === undefined) {
    throw new Error(
      `Fatal server error, cannot bootstrap: NANGO_SERVER_ROOT_DIR is not set.`
    );
  }

  fs.rmSync(serverRootDir, { recursive: true, force: true });
  fs.mkdirSync(serverRootDir);

  // Initiate nango-integrations package loading
  IntegrationsManager.getInstance().init(serverRootDir);

  // Setup connectionsManager
  ConnectionsManager.getInstance().init(path.join(serverRootDir, 'server.db'));

  // Must happen once config is loaded as it contains the log level
  logger = core.getLogger(
    IntegrationsManager.getInstance().getNangoConfig().main_server_log_level,
    core.nangoServerLogFormat,
    core.getServerLogFilePath(serverRootDir)
  );

  logger.info('Server ready!');
}

function handleRegisterConnection(nangoMsg: NangoRegisterConnectionMessage) {
  // Check if the connection already exists
  const connection = ConnectionsManager.getInstance().getConnection(
    nangoMsg.userId,
    nangoMsg.integration
  );
  if (connection !== undefined) {
    logger.warn(
      `Attempt to register an already-existing connection (integration: ${nangoMsg.integration}, user_id: ${nangoMsg.userId})`
    );
    return;
  }

  ConnectionsManager.getInstance().registerConnection(
    nangoMsg.userId,
    nangoMsg.integration,
    nangoMsg.oAuthAccessToken,
    nangoMsg.additionalConfig
  );
}

async function handleTriggerAction(nangoMsg: NangoTriggerActionMessage) {
  const integrationsManager = IntegrationsManager.getInstance();

  // Check if the integration exists
  let integrationConfig = integrationsManager.getIntegrationConfig(
    nangoMsg.integration
  );

  if (integrationConfig === null) {
    throw new Error(
      `Tried to trigger an action for an integration that does not exist: ${nangoMsg.integration}`
    );
  }

  // Check if the connection exists
  const connection = ConnectionsManager.getInstance().getConnection(
    nangoMsg.userId,
    nangoMsg.integration
  );
  if (connection === undefined) {
    throw new Error(
      `Tried to trigger action '${nangoMsg.triggeredAction}' for integration '${nangoMsg.integration}' with user_id '${nangoMsg.userId}' but no connection exists for this user_id and integration`
    );
  }

  // Check if the action (file) exists
  if (
    integrationsManager.actionExists(nangoMsg.action, nangoMsg.triggeredAction)
  ) {
    throw new Error(
      `Tried to trigger action '${nangoMsg.triggeredAction}' for integration '${nangoMsg.integration}' but the action file does not exist`
    );
  }

  // Load the JS file and execute the action
  const actionModule = await integrationsManager.getActionModule(
    nangoMsg.integration,
    nangoMsg.triggeredAction
  );
  const actionInstance = new actionModule(
    integrationsManager.getNangoConfig(),
    integrationConfig,
    connection,
    process.env['NANGO_SERVER_ROOT_DIR'],
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
