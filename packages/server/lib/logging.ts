import * as path from 'path';
import * as winston from 'winston';

export const nangoServerLogFormat = winston.format.printf((info) => {
    return `${info['timestamp']} ${info['level']} [SERVER-MAIN] ${info['message']}`;
});

export const nangoActionLogFormat = winston.format.printf((info) => {
    return `${info['timestamp']} ${info['level']} [${info['integration']}.${info['action']}, user: ${info['userId']}, exec ID #${info['actionExecutionId']}] ${info['message']}`;
});

// Helper function that configures a Winston logger with the specified properties
export function getLogger(log_level: string, logFormat: winston.Logform.Format, defaultMeta?: object): winston.Logger {
    const serverRootDir = process.env['NANGO_SERVER_ROOT_DIR'];

    const logger = winston.createLogger({
        level: log_level,
        defaultMeta: defaultMeta,
        format: winston.format.combine(winston.format.timestamp(), logFormat),
        transports: [
            new winston.transports.File({
                filename: path.join(serverRootDir!, 'nango-server.log')
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
