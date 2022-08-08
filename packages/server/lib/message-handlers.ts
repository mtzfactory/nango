/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import type {
    NangoMessageHandlerResult,
    NangoRegisterConnectionMessage,
    NangoUpdateConnectionConfigMessage,
    NangoUpdateConnectionCredentialsMessage,
    NangoTriggerActionMessage
} from '@nangohq/core';
import { ConnectionsManager } from './connections-manager.js';
import { IntegrationsManager } from './integrations-manager.js';
import * as logging from './logging.js';
import * as core from '@nangohq/core';

function createError(errorMsg: string): NangoMessageHandlerResult {
    return {
        success: false,
        errorMsg: errorMsg
    } as NangoMessageHandlerResult;
}

function createSuccess(result?: any): NangoMessageHandlerResult {
    return {
        success: true,
        returnValue: result
    } as NangoMessageHandlerResult;
}

export function handleRegisterConnection(nangoMsg: NangoRegisterConnectionMessage): NangoMessageHandlerResult {
    // Check if the connection already exists
    const connection = ConnectionsManager.getInstance().getConnection(nangoMsg.userId, nangoMsg.integration);
    if (connection !== undefined) {
        return createError(`Attempt to register an already-existing connection (integration "${nangoMsg.integration}", user_id "${nangoMsg.userId})"`);
    }

    const integrationConfig = IntegrationsManager.getInstance().getIntegrationConfig(nangoMsg.integration);
    if (!integrationConfig) {
        return createError(`Attempt to register a connection for a non-existing integration: "${nangoMsg.integration}"`);
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

export function handleUpdateConnectionConfig(nangoMsg: NangoUpdateConnectionConfigMessage): NangoMessageHandlerResult {
    // Check if the connection exists
    const connection = ConnectionsManager.getInstance().getConnection(nangoMsg.userId, nangoMsg.integration);
    if (!connection) {
        return createError(`Attempt to update a non-existing connection (integration "${nangoMsg.integration}", user_id "${nangoMsg.userId})"`);
    }

    ConnectionsManager.getInstance().updateConnectionConfig(nangoMsg.userId, nangoMsg.integration, nangoMsg.additionalConfig);

    return createSuccess();
}

export function handleUpdateConnectionCredentials(nangoMsg: NangoUpdateConnectionCredentialsMessage): NangoMessageHandlerResult {
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

export async function handleTriggerAction(nangoMsg: NangoTriggerActionMessage): Promise<NangoMessageHandlerResult> {
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
    if (integrationsManager.actionExists(nangoMsg.action, nangoMsg.triggeredAction)) {
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
    const actionInstance = new actionModule(nangoConfig, integrationConfig, connection, actionLogger, nangoMsg.triggeredAction);
    const result = await actionInstance.executeAction(nangoMsg.input);
    actionInstance.markExecutionComplete();

    return createSuccess(result);
}
