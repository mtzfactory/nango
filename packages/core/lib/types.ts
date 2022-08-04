/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

//////////////////////
// Nango Config (nango-config.yaml)
//////////////////////

export interface NangoConfig {
    default_http_request_timeout_seconds: number;
    default_action_log_level: string;

    main_server_log_level: string;

    oauth_server_enabled?: boolean;
    oauth_server_port: number;
    oauth_server_root_url: string;
}

//////////////////////
// Blueprints
//////////////////////

export interface NangoBlueprint {
    name: string;
    maintainer: string;
    docs_url?: string;
    versions: { [key: string]: NangoBlueprintConfig };
}

export interface NangoBlueprintConfig {
    comment?: string;

    auth: NangoIntegrationAuthConfig;
    requests: NangoIntegrationRequestsConfig;
}

//////////////////////
// Integrations Config (integrations.yaml)
//////////////////////

export interface NangoIntegrationsConfig {
    integrations: {
        [key: string]: NangoIntegrationsYamlIntegrationConfig;
    };
}

export enum NangoIntegrationAuthModes {
    OAuth2 = 'OAUTH2'
}

interface NangoIntegrationConfigCommon {
    [key: string]: any; // Needed so that TypeScript allows us to index this with strings. Whenever possible access directly through the properties.

    oauth_client_id?: string;
    oauth_client_secret?: string;
    oauth_scopes?: string[];

    http_request_timeout_seconds?: number;
    log_level?: string;
}

// Allowed combos are:
// - extends_blueprint
// - extends_blueprint + auth and/or requests to override the blueprint
// - auth + requests (both required if no extends_blueprint is passed)
// All other params are optional/mandatory as marked here
export interface NangoIntegrationsYamlIntegrationConfig extends NangoIntegrationConfigCommon {
    extends_blueprint?: string;

    auth?: NangoIntegrationAuthConfig;
    requests?: NangoIntegrationRequestsConfig;
}

// NangoIntegrationConfig vs NangoIntegrationsYamlIntegrationConfig:
// NangoIntegrationsYamlIntegrationConfig = Integration config as specified in integrations.yaml
// NangoIntegrationConfig = fully resolved config ready to be used (may be merged from blueprint + overrides)
//
// Unless you work on IntegrationsManager you only ever have to deal with NangoIntegrationConfig
export interface NangoIntegrationConfig extends NangoIntegrationConfigCommon {
    auth: NangoIntegrationAuthConfig;
    requests: NangoIntegrationRequestsConfig;
}

export interface NangoIntegrationAuthConfig {
    auth_mode: NangoIntegrationAuthModes.OAuth2;

    // Config related to authorization URL forward
    authorization_url: string;
    authorization_params: Record<string, string>;
    scope_separator?: string;

    // Config related to token request
    token_url: string;
    token_params: {
        grant_type: 'authorization_code' | 'client_credentials';
        [key: string]: string;
    };
    authorization_method?: OAuthAuthorizationMethod;
    body_format?: OAuthBodyFormat;

    refresh_url?: string;
}

export interface NangoIntegrationRequestsConfig {
    base_url: string;
    headers?: Record<string, string>;
    params?: Record<string, string>;
}

//////////////////////
// Client <-> Server Messages
//////////////////////

export enum NangoMessageAction {
    REGISTER_CONNECTION = 'REGISTER_CONNECTION',
    TRIGGER_ACTION = 'TRIGGER_ACTION'
}

export interface NangoMessage {
    action: NangoMessageAction;
}

export interface NangoTriggerActionMessage extends NangoMessage {
    integration: string;
    triggeredAction: string;
    userId: string;
    input: object;
}

export interface NangoRegisterConnectionMessage extends NangoMessage {
    integration: string;
    userId: string;
    oAuthAccessToken: string;
    additionalConfig?: Record<string, unknown>;
}

export interface NangoMessageHandlerResult {
    success: boolean;
    errorMsg?: string;
    returnValue?: any;
}

//////////////////////
// OAuth Server
//////////////////////

export enum OAuthAuthorizationMethod {
    BODY = 'body',
    HEADER = 'header'
}

export enum OAuthBodyFormat {
    FORM = 'form',
    JSON = 'json'
}

export interface OAuthSessionStore {
    [key: string]: OAuthSession;
}

export interface OAuthSession {
    integrationName: string;
    callbackUrl: string;
}

//////////////////////
// Varia
//////////////////////

export interface NangoConnection {
    uuid: string;
    integration: string;
    userId: string;
    oAuthAccessToken: string;
    additionalConfig: Record<string, unknown> | undefined;
}

export interface HttpHeader {
    [key: string]: string;
}

export interface HttpParams {
    [key: string]: string;
}

export enum HTTPMethods {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PATCH = 'PATCH',
    TRACE = 'TRACE',
    CONNECT = 'CONNECT',
    OPTIONS = 'OPTIONS'
}

export enum ServerRunMode {
    LOCAL_DEV = 'LOCAL_DEV',
    DOCKERIZED = 'DOCKERIZED',
    PROD = 'PROD'
}
