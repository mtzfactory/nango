import type {
  NangoMessageHandlerResult,
  NangoRegisterConnectionMessage,
  NangoTriggerActionMessage
} from '@nangohq/core';
import { ConnectionsManager } from './connections.js';
import { IntegrationsManager } from './nango-integrations.js';

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

export function handleRegisterConnection(
  nangoMsg: NangoRegisterConnectionMessage
): NangoMessageHandlerResult {
  // Check if the connection already exists
  const connection = ConnectionsManager.getInstance().getConnection(
    nangoMsg.userId,
    nangoMsg.integration
  );
  if (connection !== undefined) {
    return createError(
      `Attempt to register an already-existing connection (integration: ${nangoMsg.integration}, user_id: ${nangoMsg.userId})`
    );
  }

  ConnectionsManager.getInstance().registerConnection(
    nangoMsg.userId,
    nangoMsg.integration,
    nangoMsg.oAuthAccessToken,
    nangoMsg.additionalConfig
  );

  return createSuccess();
}

export async function handleTriggerAction(
  nangoMsg: NangoTriggerActionMessage
): Promise<NangoMessageHandlerResult> {
  const integrationsManager = IntegrationsManager.getInstance();

  // Check if the integration exists
  let integrationConfig = integrationsManager.getIntegrationConfig(
    nangoMsg.integration
  );

  if (integrationConfig === null) {
    return createError(
      `Tried to trigger an action for an integration that does not exist: ${nangoMsg.integration}`
    );
  }

  // Check if the connection exists
  const connection = ConnectionsManager.getInstance().getConnection(
    nangoMsg.userId,
    nangoMsg.integration
  );
  if (connection === undefined) {
    return createError(
      `Tried to trigger action '${nangoMsg.triggeredAction}' for integration '${nangoMsg.integration}' with user_id '${nangoMsg.userId}' but no connection exists for this user_id and integration`
    );
  }

  // Check if the action (file) exists
  if (
    integrationsManager.actionExists(nangoMsg.action, nangoMsg.triggeredAction)
  ) {
    return createError(
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

  return createSuccess(result);
}
