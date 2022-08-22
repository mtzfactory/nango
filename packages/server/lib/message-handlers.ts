/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import type {
    NangoMessageHandlerResult,
    NangoRegisterConnectionMessage,
    NangoUpdateConnectionConfigMessage,
    NangoUpdateConnectionCredentialsMessage,
    NangoTriggerActionMessage,
    NangoGetUserIdConnectionsMessage,
    NangoConnectionPublic,
    NangoGetIntegrationConnectionsMessage
} from '@nangohq/core';
import { ConnectionsManager } from './connections-manager.js';
import { IntegrationsManager } from './integrations-manager.js';
import * as logging from './logging.js';
import * as core from '@nangohq/core';

export function createError(errorMsg: string): NangoMessageHandlerResult<any> {
    return {
        success: false,
        errorMsg: errorMsg
    } as NangoMessageHandlerResult<any>;
}

function createSuccess<T>(result?: T): NangoMessageHandlerResult<T> {
    return {
        success: true,
        returnValue: result
    } as NangoMessageHandlerResult<T>;
}

export function handleRegisterConnection(nangoMsg: NangoRegisterConnectionMessage): NangoMessageHandlerResult<undefined> {
    // Check if the connection already exists
    const connection = ConnectionsManager.getInstance().getConnection(nangoMsg.userId, nangoMsg.integration);
    if (connection !== undefined) {
        return createError(`Attempt to register an already-existing connection (integration "${nangoMsg.integration}", user_id "${nangoMsg.userId})"`);
    }

    const integrationConfig = IntegrationsManager.getInstance().getIntegrationConfig(nangoMsg.integration);
    if (!integrationConfig) {
        return createError(`Attempt to register a connection for a non-existing integration: "${nangoMsg.integration}"`);
    }

    // Check if the new config if JSON serializable
    try {
        JSON.stringify(nangoMsg.additionalConfig);
    } catch {
        return createError(
            `additionalConfig is not JSON serializable, please provide a serializable config. (integration "${nangoMsg.integration}", user_id "${nangoMsg.userId})"`
        );
    }

    // Connections manager will raise an exception if the credentials passed in are not conformant to what we expect for this integration
    try {
        ConnectionsManager.getInstance().insertConnection(
            nangoMsg.userId,
            nangoMsg.integration,
            nangoMsg.credentials,
            integrationConfig.auth.auth_mode,
            nangoMsg.additionalConfig
        );
    } catch (e) {
        return createError(
            `Could not save connection, passed in credentials are invalid for the integration "${nangoMsg.integration}" which has auth mode "${
                integrationConfig.auth.auth_mode
            }" - error returned was: "${(e as Error).message}"`
        );
    }

    return createSuccess();
}

export function handleUpdateConnectionConfig(nangoMsg: NangoUpdateConnectionConfigMessage): NangoMessageHandlerResult<undefined> {
    // Check if the connection exists
    const connection = ConnectionsManager.getInstance().getConnection(nangoMsg.userId, nangoMsg.integration);
    if (!connection) {
        return createError(`Attempt to update a non-existing connection (integration "${nangoMsg.integration}", user_id "${nangoMsg.userId})"`);
    }

    // Check if the new config if JSON serializable
    try {
        JSON.stringify(nangoMsg.additionalConfig);
    } catch {
        return createError(
            `New additionalConfig is not JSON serializable, please provide a serializable config. (integration "${nangoMsg.integration}", user_id "${nangoMsg.userId})"`
        );
    }

    ConnectionsManager.getInstance().updateConnectionConfig(nangoMsg.userId, nangoMsg.integration, nangoMsg.additionalConfig);

    return createSuccess();
}

export function handleUpdateConnectionCredentials(nangoMsg: NangoUpdateConnectionCredentialsMessage): NangoMessageHandlerResult<undefined> {
    // Check if the connection exists
    const connection = ConnectionsManager.getInstance().getConnection(nangoMsg.userId, nangoMsg.integration);
    if (!connection) {
        return createError(`Attempt to update a non-existing connection (integration "${nangoMsg.integration}", user_id "${nangoMsg.userId})"`);
    }

    const integrationConfig = IntegrationsManager.getInstance().getIntegrationConfig(nangoMsg.integration);
    if (!integrationConfig) {
        return createError(`Attempt to update a connection for a non-existing integration: "${nangoMsg.integration}"`);
    }

    // Connections manager will raise an exception if the credentials passed in are not conformant to what we expect for this integration
    try {
        ConnectionsManager.getInstance().updateConnectionCredentials(
            nangoMsg.userId,
            nangoMsg.integration,
            nangoMsg.credentials,
            integrationConfig.auth.auth_mode
        );
    } catch (e) {
        return createError(
            `Could not save connection, passed in credentials are invalid for the integration "${nangoMsg.integration}" which has auth mode "${
                integrationConfig.auth.auth_mode
            }" - error returned was: "${(e as Error).message}"`
        );
    }

    return createSuccess();
}

export function handleGetUserIdConnections(nangoMsg: NangoGetUserIdConnectionsMessage): NangoMessageHandlerResult<NangoConnectionPublic[]> {
    // Get the connections
    let connections;
    try {
        connections = ConnectionsManager.getInstance().getConnectionsForUserId(nangoMsg.userId);
    } catch (e) {
        return createError(`There was a problem retrieving the connections for user with Id "${nangoMsg.userId}": ${(e as Error).message}`);
    }

    // For security reasons publicly returned connections do not have the credentials included
    let finalConnections: NangoConnectionPublic[] = [];
    for (const connection of connections) {
        const publicConnection = {
            uuid: connection.uuid,
            userId: connection.userId,
            integration: connection.integration,
            dateCreated: connection.dateCreated,
            lastModified: connection.lastModified,
            additionalConfig: connection.additionalConfig
        } as NangoConnectionPublic;
        finalConnections.push(publicConnection);
    }

    return createSuccess(finalConnections);
}

export function handleGetIntegrationConnections(nangoMsg: NangoGetIntegrationConnectionsMessage): NangoMessageHandlerResult<NangoConnectionPublic[]> {
    // Get the connections
    let connections;
    try {
        connections = ConnectionsManager.getInstance().getConnectionsForIntegration(nangoMsg.integration);
    } catch (e) {
        return createError(`There was a problem retrieving the connections for integration "${nangoMsg.integration}": ${(e as Error).message}`);
    }

    // For security reasons publicly returned connections do not have the credentials included
    let finalConnections: NangoConnectionPublic[] = [];
    for (const connection of connections) {
        const publicConnection = {
            uuid: connection.uuid,
            userId: connection.userId,
            integration: connection.integration,
            dateCreated: connection.dateCreated,
            lastModified: connection.lastModified,
            additionalConfig: connection.additionalConfig
        } as NangoConnectionPublic;
        finalConnections.push(publicConnection);
    }

    return createSuccess(finalConnections);
}

export async function handleTriggerAction(nangoMsg: NangoTriggerActionMessage): Promise<NangoMessageHandlerResult<any>> {
    const integrationsManager = IntegrationsManager.getInstance();

    // Check if the integration exists
    let integrationConfig = integrationsManager.getIntegrationConfig(nangoMsg.integration);

    if (integrationConfig === null) {
        return createError(`Tried to trigger an action for an integration that does not exist: ${nangoMsg.integration}`);
    }

    // Check if the connection exists
    const connection = ConnectionsManager.getInstance().getConnection(nangoMsg.userId, nangoMsg.integration);
    if (connection === undefined) {
        return createError(
            `Tried to trigger action "${nangoMsg.triggeredAction}" for integration "${nangoMsg.integration}" with user_id "${nangoMsg.userId}" but no connection exists for this user_id and integration`
        );
    }

    // Check if the action (file) exists
    if (!integrationsManager.actionExists(nangoMsg.integration, nangoMsg.triggeredAction)) {
        return createError(
            `Tried to trigger action "${nangoMsg.triggeredAction}" for integration "${nangoMsg.integration}" but the action file does not exist`
        );
    }

    // Create a logger for the execution of the action
    const nangoConfig = integrationsManager.getNangoConfig();
    const log_level = integrationConfig?.log_level ? integrationConfig.log_level : nangoConfig.default_action_log_level;
    const defaultMeta = {
        integration: connection.integration,
        action: nangoMsg.triggeredAction,
        userId: connection.userId,
        actionExecutionId: core.makeId(8)
    };

    const actionLogger = logging.getLogger(log_level, logging.nangoActionLogFormat, defaultMeta);

    // Load the JS file and execute the action
    const actionModule = await integrationsManager.getActionModule(nangoMsg.integration, nangoMsg.triggeredAction);
    const actionInstance = new actionModule(
        nangoConfig,
        integrationConfig,
        connection,
        ConnectionsManager.getInstance(),
        actionLogger,
        nangoMsg.triggeredAction
    );
    try {
        const result = await actionInstance.executeAction(nangoMsg.input);
        actionInstance.markExecutionComplete();
        return createSuccess(result);
    } catch (e) {
        let errorMessage = `There was an error during the action execution: ${(e as Error).message}`;
        let shortErrorMessage = (e as Error).message;
        if ((e as Error).stack) {
            errorMessage += ` - ${(e as Error).stack}`;
            shortErrorMessage += ` - ${(e as Error).stack}`;
        }
        actionLogger.error(`🏁❌ Execution of action failed: ${shortErrorMessage}`);
        return createError(errorMessage);
    }
}
