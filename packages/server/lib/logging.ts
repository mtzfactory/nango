/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import * as path from 'path';
import * as winston from 'winston';
import * as core from '@nangohq/core';

export const nangoServerLogFormat = winston.format.printf((info) => {
    return `${info['timestamp']} ${info['level']} [SERVER-MAIN] ${info['message']}`;
});

export const nangoActionLogFormat = winston.format.printf((info) => {
    return `${info['timestamp']} ${info['level']} [${info['integration']}] [${info['action']}] [user-id: ${info['userId']}] [exec ID: #${info['actionExecutionId']}] ${info['message']}`;
});

// Helper function that configures a Winston logger with the specified properties
export function getLogger(log_level: string, logFormat: winston.Logform.Format, defaultMeta?: object): winston.Logger {
    const serverRootDir = process.env['NANGO_SERVER_ROOT_DIR'];
    const ServerRunMode = process.env['NANGO_SERVER_RUN_MODE'];

    let serverWorkingDir = serverRootDir!;
    if (ServerRunMode === core.ServerRunMode.LOCAL_DEV) {
        serverWorkingDir = path.join(serverRootDir!, 'server-files');
    }

    const logger = winston.createLogger({
        level: log_level,
        defaultMeta: defaultMeta,
        format: winston.format.combine(winston.format.timestamp(), logFormat),
        transports: [
            new winston.transports.File({
                filename: path.join(serverWorkingDir, 'nango-server.log')
            })
        ]
    });

    if (process.env['NODE_ENV'] !== 'production') {
        logger.add(
            new winston.transports.Console({
                format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), logFormat)
            })
        );
    }

    logger.silly('A SQL query goes to a bar, walks up to two tables and asks: "Can I join you?"');

    return logger;
}
