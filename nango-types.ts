//////////////////////
// Nango Config (nango-config.yaml)
//////////////////////

export interface NangoConfig {
    nango_server_host: string,
    nango_server_port: number,

    nango_integrations_pkg_path: string
}

//////////////////////
// Integrations Config (integrations.yaml)
//////////////////////

export interface NangoIntegrationsConfig {
    integrations: Array<NangoIntegrationWrapper>
}

export enum NangoIntegrationAuthModes {
    BASIC_AUTH,
    OAUTH
}

export interface NangoIntegrationWrapper {
    [key: string]: NangoIntegrationConfig
}

export interface NangoIntegrationConfig {
    base_url: string,
    auth_mode: NangoIntegrationAuthModes,
    call_auth: NangoCallAuth
}

export enum NangoCallAuthModes {
    AUTH_HEADER_TOKEN
}

export interface NangoCallAuth {
    mode: NangoCallAuthModes,
    header_name?: string
}

//////////////////////
// Client <-> Server Messages
//////////////////////

export enum NangoMessageAction {
    LOAD_CONFIG = "LOAD_CONFIG",
    REGISTER_CONNECTION = "REGISTER_CONNECTION",
    TRIGGER_ACTION = "TRIGGER_ACTION"
}

export interface NangoMessage {
    action: NangoMessageAction
}

export interface NangoLoadConfigMessage extends NangoMessage {
    config: NangoConfig;
}

export interface NangoTriggerActionMessage extends NangoMessage {
    integration: string,
    triggeredAction: string,
    userId: string,
    input: object
}

export interface NangoRegisterConnectionMessage extends NangoMessage {
    integration: string,
    userId: string,
    oAuthAccessToken: string,
    additionalConfig: object,
}
