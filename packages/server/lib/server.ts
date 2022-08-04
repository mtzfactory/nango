/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoMessage, NangoMessageAction, NangoMessageHandlerResult, NangoRegisterConnectionMessage, NangoTriggerActionMessage } from '@nangohq/core';
import * as core from '@nangohq/core';
import * as logging from './logging.js';
import * as path from 'path';
import * as fs from 'fs';
import { connect, ConsumeMessage, Channel, Connection } from 'amqplib';
import type winston from 'winston';
import { ConnectionsManager } from './connections-manager.js';
import { IntegrationsManager } from './integrations-manager.js';
import { handleRegisterConnection, handleTriggerAction } from './message-handlers.js';
import { startOAuthServer } from './oauth-server.js';

/** -------------------- Server Internal Properties -------------------- */

const inboundSeverQueue = 'server_inbound';
let rabbitConnection: Connection;
let rabbitChannel: Channel | null = null;

let logger: winston.Logger;

// Retry count for rabbitMQ connection
let rabbitConnectionTries = 0;

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
                logger.debug(`Result from action: ${JSON.stringify(result.returnValue)}`);
            }
            break;
        }
        default: {
            throw new Error(`Received inbound server message with unknown action: ${nangoMessage.action}`);
        }
    }

    rabbitChannel?.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result), 'utf8'), {
        correlationId: msg.properties.correlationId
    });

    rabbitChannel?.ack(msg);
}

function bootstrapServer() {
    // Load env variables, based on mode setup working dir for server to store logs & DB
    const serverRootDir = process.env['NANGO_SERVER_ROOT_DIR'];
    const serverRunMode = process.env['NANGO_SERVER_RUN_MODE'];

    if (serverRootDir === undefined) {
        throw new Error(`Fatal server error, cannot bootstrap: NANGO_SERVER_ROOT_DIR is not set.`);
    }

    if (serverRunMode === undefined) {
        throw new Error(`Fatal server error, cannot bootstrap: NANGO_SERVER_RUN_MODE is not set.`);
    }

    let serverWorkingDir = serverRootDir;
    if (serverRunMode === core.ServerRunMode.LOCAL_DEV) {
        serverWorkingDir = path.join(serverRootDir, 'server-files');
    }

    if (!fs.existsSync(serverWorkingDir)) {
        fs.mkdirSync(serverWorkingDir);
    }

    // Initiate nango-integrations package loading
    IntegrationsManager.getInstance().init(serverRootDir);

    // Setup connectionsManager
    ConnectionsManager.getInstance().init(path.join(serverWorkingDir, 'server.db'));

    // Start the OAuth HTTP server
    const nangoConfig = IntegrationsManager.getInstance().getNangoConfig();
    if (nangoConfig.oauth_server_enabled === undefined || nangoConfig.oauth_server_enabled === true) {
        startOAuthServer();
    }

    // Must happen once config is loaded as it contains the log level
    logger = logging.getLogger(nangoConfig.main_server_log_level, logging.nangoServerLogFormat);
}

async function connectRabbit() {
    const rabbitHost = process.env['NANGO_SERVER_RABBIT_HOST'];
    let rabbitPort = process.env['NANGO_SERVER_PORT'];
    rabbitPort = rabbitPort ? rabbitPort : '5672';

    if (rabbitHost === undefined) {
        throw new Error(`Fatal server error, cannot bootstrap: NANGO_SERVER_RABBIT_HOST is not set.`);
    }

    connect(`amqp://${rabbitHost}:${rabbitPort}`)
        .then(async (connection) => {
            rabbitConnection = connection;

            rabbitChannel = await rabbitConnection.createChannel();
            await rabbitChannel.assertQueue(inboundSeverQueue);

            rabbitChannel.consume(inboundSeverQueue, handleInboundMessage);

            logger!.info('✅ Nango Server is ready!');
        })
        .catch((error) => {
            rabbitConnectionTries++;

            if (rabbitConnectionTries < 10) {
                logger.warn(`Failed to connect to rabbitMQ, got error: ${error}\nWill retry ${10 - rabbitConnectionTries} more times, next in 5 seconds...`);
                setTimeout(connectRabbit, 5000);
            } else {
                logger.warn(`Failed to connect to rabbitMQ, got error: ${error}\n`);
                logger.error('Failed to connect to rabbitMQ, maximum number of retries exceeded. This is a fatal server bootstrap error, giving up 💣`');
                logger!.error('\n❌ Failed to start server.\n');

                // Give logger some time to write (otherwise we might miss these crucial log messages)
                setTimeout(() => {
                    process.exit(1);
                }, 500);
            }
        });
}

// Alright, let's run!
try {
    bootstrapServer(); // Must happen before we start to process messages
    connectRabbit();
} catch (e) {
    if (logger!) {
        logger!.error(e);
        logger!.error('\n❌ Failed to start server.\n');
    } else {
        console.error(e);
        console.error('\n❌ Failed to start server.\n');
    }

    // Give logger some time to write (otherwise we might miss these crucial log messages)
    setTimeout(() => {
        process.exit(1);
    }, 500);
}
