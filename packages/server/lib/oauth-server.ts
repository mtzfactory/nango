import express from 'express';
import { IntegrationsManager } from './integrations-manager.js';
import * as uuid from 'uuid';
import simpleOauth2 from 'simple-oauth2';
import { NangoIntegrationConfig, OAuthAuthorizationMethod, OAuthBodyFormat, OAuthSession, OAuthSessionStore } from '@nangohq/core';

const app = express();

const sessionStore: OAuthSessionStore = {};

function getSimpleOAuthClientConfig(integrationConfig: NangoIntegrationConfig) {
    const tokenUrl = new URL(integrationConfig.auth.token_url);
    const authorizeUrl = new URL(integrationConfig.auth.authorization_url);
    const headers = { 'User-Agent': 'Nango' };

    const config = {
        client: {
            id: integrationConfig.oauth_client_id!,
            secret: integrationConfig.oauth_client_secret!
        },
        auth: {
            tokenHost: tokenUrl.origin,
            tokenPath: tokenUrl.pathname,
            authorizeHost: authorizeUrl.origin,
            authorizePath: authorizeUrl.pathname
        },
        http: { headers: headers },
        options: {
            authorizationMethod: integrationConfig.auth.authorization_method || OAuthAuthorizationMethod.BODY,
            bodyFormat: integrationConfig.auth.body_format || OAuthBodyFormat.FORM,
            scopeSeparator: integrationConfig.auth.scope_separator || ' '
        }
    };

    return config;
}

export function startOAuthServer() {
    const port = IntegrationsManager.getInstance().getNangoConfig().oauth_server_port;

    app.get('/oauth/connect/:integration', (req, res) => {
        const { integration } = req.params;
        const integrationConfig = IntegrationsManager.getInstance().getIntegrationConfig(integration);

        let serverRootUrl = IntegrationsManager.getInstance().getNangoConfig().oauth_server_root_url;
        serverRootUrl = serverRootUrl.slice(-1) !== '/' ? serverRootUrl + '/' : serverRootUrl;
        const callbackUrl = serverRootUrl + 'oauth/callback';

        const authState = uuid.v1();
        sessionStore[authState] = {
            integrationName: integration,
            callbackUrl: callbackUrl
        };

        if (
            integrationConfig.oauth_client_id === undefined ||
            integrationConfig.oauth_client_secret === undefined ||
            integrationConfig.oauth_scopes === undefined
        ) {
            throw new Error(
                `Cannot run OAuth flow for "${integration}", all of these parameters must be set in integrations.yaml config:\noauth_client_id, oauth_client_secret, oauth_scopes`
            );
        }

        let additionalAuthParams = {};
        if (integrationConfig.auth.authorization_params !== null) {
            additionalAuthParams = integrationConfig.auth.authorization_params;
        }

        if (
            integrationConfig.auth.token_params === undefined ||
            integrationConfig.auth.token_params.grant_type === undefined ||
            integrationConfig.auth.token_params.grant_type === 'authorization_code'
        ) {
            const simpleOAuthClient = new simpleOauth2.AuthorizationCode(getSimpleOAuthClientConfig(integrationConfig));
            const authorizationUri = simpleOAuthClient.authorizeURL({
                redirect_uri: callbackUrl,
                scope: integrationConfig.oauth_scopes,
                state: authState,
                ...additionalAuthParams
            });

            res.redirect(authorizationUri);
        } else {
            throw new Error(`Unsupported grant type "${integrationConfig.auth.token_params.grant_type}" for integration "${integration}".`);
        }
    });

    app.get('/oauth/callback', async (req, res) => {
        const { code, state } = req.query;
        const sessionData = sessionStore[state as string] as OAuthSession;

        if (code === undefined || state === undefined || sessionData === undefined) {
            let errorMessage = '';
            if (state === undefined || sessionData === undefined) {
                errorMessage = 'OAuth flow failed, did not get a valid state parameter back';
            } else if (code === undefined) {
                const { error } = req.query;
                if (error !== undefined) {
                    errorMessage = `OAuth flow failed, the provider answered with error: ${error}`;
                } else {
                    errorMessage = 'OAuth flow failed, did not get any error back from server. Sorry!';
                }
            }
            res.status(403).json(errorMessage);
        }

        const integrationConfig = IntegrationsManager.getInstance().getIntegrationConfig(sessionData.integrationName!);

        if (
            integrationConfig.auth.token_params === undefined ||
            integrationConfig.auth.token_params.grant_type === undefined ||
            integrationConfig.auth.token_params.grant_type === 'authorization_code'
        ) {
            const simpleOAuthClient = new simpleOauth2.AuthorizationCode(getSimpleOAuthClientConfig(integrationConfig));

            let additionalTokenParams = {};
            if (integrationConfig.auth.token_params !== undefined) {
                // We need to remove grant_type, simpleOAuth2 handles that for us
                const deepCopy = JSON.parse(JSON.stringify(integrationConfig.auth.token_params));
                delete deepCopy.grant_type;
                additionalTokenParams = deepCopy;
            }

            try {
                const accessToken = await simpleOAuthClient.getToken({
                    code: code as string,
                    redirect_uri: sessionData.callbackUrl,
                    ...additionalTokenParams
                });

                return res.status(200).json(accessToken);
            } catch (e) {
                console.log(`Uh oh, there was an error getting the access token: %d`, e);
                return res.status(500).json(e);
            }
        }
        return res.status(500).json('not implemented');
    });

    app.listen(port);
}
