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
    OAuth1 = 'OAUTH1',
    OAuth2 = 'OAUTH2',
    UsernamePassword = 'USERNAME_PASSWORD',
    ApiKey = 'API_KEY'
}

export type NangoAuthCredentials = NangoOAuth2Credentials | NangoUsernamePasswordCredentials | NangoApiKeyCredentials | NangoOAuth1Credentials;

interface NangoCredentialsCommon {
    type: NangoIntegrationAuthModes;
    raw: Record<string, string>; // Raw response for credentials as received by the OAuth server or set by the user
}

export interface NangoOAuth2Credentials extends NangoCredentialsCommon {
    type: NangoIntegrationAuthModes.OAuth2;
    accessToken: string;

    refreshToken?: string;
    expiresAt?: Date;
}

export interface NangoUsernamePasswordCredentials extends NangoCredentialsCommon {
    type: NangoIntegrationAuthModes.UsernamePassword;
    username: string;
    password: string;
}

export interface NangoApiKeyCredentials extends NangoCredentialsCommon {
    type: NangoIntegrationAuthModes.ApiKey;
    apiKey: string;
}

export interface NangoOAuth1Credentials extends NangoCredentialsCommon {
    type: NangoIntegrationAuthModes.OAuth1;
    oAuthToken: string;
    oAuthTokenSecret: string;
}

interface NangoIntegrationConfigCommon {
    [key: string]: any; // Needed so that TypeScript allows us to index this with strings. Whenever possible access directly through the properties.

    oauth_client_id?: string;
    oauth_client_secret?: string;
    oauth_scopes?: string[];

    app_api_key?: string; // App wide api key, can be used as a variable in NangoIntegrationRequestsConfig

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
    // The authentication mode to use (e.g. OAuth 1, OAuth 2)
    auth_mode: NangoIntegrationAuthModes;

    // Config related to authorization URL forward
    authorization_url: string;
    authorization_params?: Record<string, string>;
    scope_separator?: string;

    // Config related to token request
    token_url: string;
    token_params?: {
        [key: string]: string;
    };
}

export interface NangoIntegrationAuthConfigOAuth1 extends NangoIntegrationAuthConfig {
    auth_mode: NangoIntegrationAuthModes.OAuth1;

    request_url: string;
    request_params?: Record<string, string>;
    request_http_method?: 'GET' | 'PUT' | 'POST'; // Defaults to POST if not provided

    token_http_method?: 'GET' | 'PUT' | 'POST'; // Defaults to POST if not provided

    signature_method: 'HMAC-SHA1' | 'RSA-SHA1' | 'PLAINTEXT';
}

export interface NangoIntegrationAuthConfigOAuth2 extends NangoIntegrationAuthConfig {
    auth_mode: NangoIntegrationAuthModes.OAuth2;

    token_params?: {
        grant_type?: 'authorization_code' | 'client_credentials';
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
    UPDATE_CONNECTION_CREDENTIALS = 'UPDATE_CONNECTION_CREDENTIALS',
    UPDATE_CONNECTION_CONFIG = 'UPDATE_CONNECTION_CONFIG',
    TRIGGER_ACTION = 'TRIGGER_ACTION'
}

export interface NangoMessage {
    action: NangoMessageAction;
}

export interface NangoTriggerActionMessage extends NangoMessage {
    action: NangoMessageAction.TRIGGER_ACTION;
    integration: string;
    triggeredAction: string;
    userId: string;
    input: object;
}

export interface NangoRegisterConnectionMessage extends NangoMessage {
    action: NangoMessageAction.REGISTER_CONNECTION;
    integration: string;
    userId: string;
    credentials: NangoAuthCredentials;
    additionalConfig?: Record<string, unknown>;
}

export interface NangoUpdateConnectionCredentialsMessage extends NangoMessage {
    action: NangoMessageAction.UPDATE_CONNECTION_CREDENTIALS;
    integration: string;
    userId: string;
    credentials: NangoAuthCredentials;
}

export interface NangoUpdateConnectionConfigMessage extends NangoMessage {
    action: NangoMessageAction.UPDATE_CONNECTION_CONFIG;
    integration: string;
    userId: string;
    additionalConfig: Record<string, unknown>;
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
    userId: string;
    callbackUrl: string;
    authMode: NangoIntegrationAuthModes;

    // Needed for oAuth 1.0a
    request_token_secret?: string;
}

//////////////////////
// Varia
//////////////////////

export interface NangoConnection {
    uuid: string;
    integration: string;
    userId: string;
    authMode: NangoIntegrationAuthModes;
    credentials: NangoAuthCredentials;
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
