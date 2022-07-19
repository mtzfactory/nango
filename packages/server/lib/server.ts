import {
  NangoMessage,
  NangoMessageAction,
  NangoMessageHandlerResult,
  NangoRegisterConnectionMessage,
  NangoTriggerActionMessage
} from '@nangohq/core';
import * as logging from './logging.js';
import * as fs from 'fs';
import * as path from 'path';
import { connect, ConsumeMessage, Channel, Connection } from 'amqplib';
import type winston from 'winston';
import { ConnectionsManager } from './connections-manager.js';
import { IntegrationsManager } from './integrations-manager.js';
import {
  handleRegisterConnection,
  handleTriggerAction
} from './message-handlers.js';

/** -------------------- Server Internal Properties -------------------- */

const inboundSeverQueue = 'server_inbound';
let rabbitConnection: Connection;
let inboundRabbitChannel: Channel | null = null;

let logger: winston.Logger;

/** -------------------- Inbound message handling -------------------- */

async function handleInboundMessage(msg: ConsumeMessage | null) {
  if (msg === null) {
    return; // Skipp non-existing messages (honestly no idea why we might get null here but supposedly it can happen)
  }

  const nangoMessage = JSON.parse(msg.content.toString()) as NangoMessage;

  logger.debug(`Server received message:\n${msg.content.toString()}`);

  let result: NangoMessageHandlerResult;
  switch (nangoMessage.action) {
    case NangoMessageAction.REGISTER_CONNECTION: {
      const registerMessage = nangoMessage as NangoRegisterConnectionMessage;
      result = handleRegisterConnection(registerMessage);
      break;
    }
    case NangoMessageAction.TRIGGER_ACTION: {
      const triggerMessage = nangoMessage as NangoTriggerActionMessage;
      result = await handleTriggerAction(triggerMessage);
      if (result.success) {
        logger.debug(
          `Result from action: ${JSON.stringify(result.returnValue)}`
        );
      }
      break;
    }
    default: {
      throw new Error(
        `Received inbound server message with unknown action: ${nangoMessage.action}`
      );
    }
  }

  inboundRabbitChannel?.ack(msg);

  const outboundRabbitChannel = await rabbitConnection.createChannel();
  await outboundRabbitChannel.assertQueue(msg.properties.replyTo);
  outboundRabbitChannel?.sendToQueue(
    msg.properties.replyTo,
    Buffer.from(JSON.stringify(result), 'utf8'),
    {
      correlationId: msg.properties.correlationId
    }
  );
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
  logger = logging.getLogger(
    IntegrationsManager.getInstance().getNangoConfig().main_server_log_level,
    logging.nangoServerLogFormat
  );

  logger.info('Server ready!');
}

async function connectRabbit() {
  rabbitConnection = await connect('amqp://localhost');

  inboundRabbitChannel = await rabbitConnection.createChannel();
  await inboundRabbitChannel.assertQueue(inboundSeverQueue);

  inboundRabbitChannel.consume(inboundSeverQueue, handleInboundMessage);
}

// Alright, let's run!
bootstrapServer(); // Must happen before we start to process messages
connectRabbit();
