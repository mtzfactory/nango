//////////////////////
// Nango Config (nango-config.yaml)
//////////////////////

export interface NangoConfig {
    default_http_request_timeout_seconds: number
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
    call_auth: NangoCallAuth,
    http_request_timeout_seconds?: number,
}

export enum NangoCallAuthModes {
    AUTH_HEADER_TOKEN = "AUTH_HEADER_TOKEN"
}

export interface NangoCallAuth {
    mode: NangoCallAuthModes,
    header_name?: string
}

//////////////////////
// Client <-> Server Messages
//////////////////////

export enum NangoMessageAction {
    REGISTER_CONNECTION = "REGISTER_CONNECTION",
    TRIGGER_ACTION = "TRIGGER_ACTION"
}

export interface NangoMessage {
    action: NangoMessageAction
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


//////////////////////
// Varia
//////////////////////

export interface NangoConnection {
    uuid: string,
    integration: string,
    userId: string,
    oAuthAccessToken: string,
    additionalConfig: object
}

export interface HttpHeader {
    [key: string]: string
}

export interface HttpParams {
    [key: string]: string
}


export enum HTTPMethods {
    POST = "POST",
    GET = "GET",
    PUT = "PUT",
    DELETE = "DELETE",
    HEAD = "HEAD",
    PATCH = "PATCH",
    TRACE = "TRACE",
    CONNECT = "CONNECT",
    OPTIONS = "OPTIONS"
}