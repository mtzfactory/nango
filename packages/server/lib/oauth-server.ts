/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import express from 'express';
import { IntegrationsManager } from './integrations-manager.js';
import * as uuid from 'uuid';
import simpleOauth2 from 'simple-oauth2';
import type { NangoIntegrationConfig, OAuthSession, OAuthSessionStore } from '@nangohq/core';
import { OAuthAuthorizationMethod, OAuthBodyFormat } from '@nangohq/core';
import * as core from '@nangohq/core';

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
        let { userId } = req.query;
        userId = userId as string;

        let integrationConfig;
        try {
            integrationConfig = IntegrationsManager.getInstance().getIntegrationConfig(integration);
        } catch {
            return sendResultHTML(
                res,
                integration,
                userId,
                'unknown_integration',
                `Authentication failed: This Nango instance does not have a configuration for the integration "${integration}". Do you have a typo?`
            );
        }

        if (!userId) {
            return sendResultHTML(
                res,
                integration,
                userId,
                'missing_user_id',
                'Authentication failed: Missing userId, it is required and cannot be an empty string.'
            );
        } else if (!integration) {
            return sendResultHTML(
                res,
                integration,
                userId,
                'missing_integration',
                'Authentication failed: Missing integration name, it is required and cannot be an empty string.'
            );
        }

        let serverRootUrl = IntegrationsManager.getInstance().getNangoConfig().oauth_server_root_url;
        serverRootUrl = serverRootUrl.slice(-1) !== '/' ? serverRootUrl + '/' : serverRootUrl;
        const callbackUrl = serverRootUrl + 'oauth/callback';

        const authState = uuid.v1();
        sessionStore[authState] = {
            integrationName: integration,
            userId: userId as string,
            callbackUrl: callbackUrl
        };

        if (!integrationConfig.oauth_client_id || !integrationConfig.oauth_client_secret || integrationConfig.oauth_scopes === undefined) {
            return sendResultHTML(
                res,
                integration,
                userId,
                'invalid_integration_configuration',
                `Authentication failed: The configuration for integration "${integration}" is missing required parameters. All of these must be present: oauth_client_id (got: ${integrationConfig.oauth_client_id}), oauth_client_secret (got: ${integrationConfig.oauth_client_secret}) and oauth_scopes (got: ${integrationConfig.oauth_scopes}).`
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
            return sendResultHTML(
                res,
                integration,
                userId,
                'unsupported_grant_type',
                `Authentication failed: The grant type "${integrationConfig.auth.token_params.grant_type}" is not supported by this OAuth flow. Please check the documentation or contact support.`
            );
        }
    });

    app.get('/oauth/callback', async (req, res) => {
        const { code, state } = req.query;
        const sessionData = sessionStore[state as string] as OAuthSession;

        if (code === undefined || state === undefined || sessionData === undefined) {
            let errorType = '';
            let errorMessage = '';
            if (state === undefined || sessionData === undefined) {
                errorType = 'invalid_state_callback';
                errorMessage = 'Authorization failed: The external server did not send a valid state parameter back in the callback';
            } else if (code === undefined) {
                const { error } = req.query;
                if (error !== undefined) {
                    errorType = 'external_callback_error';
                    errorMessage = `Authorization failed: The external server responded with error in the callback: ${error}`;
                } else {
                    errorType = 'unknown_external_callback_error';
                    errorMessage = `Authorization failed: The external server did not provide an authorization code in the callback. Unfortunately no additional errors were reported by the server. The full callback URI was: ${req.originalUrl}`;
                }
            }
            return sendResultHTML(res, sessionData.integrationName, sessionData.userId, errorType, errorMessage);
        }

        const integrationConfig = IntegrationsManager.getInstance().getIntegrationConfig(sessionData.integrationName!);

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

            console.log('Ok we should do somthing with this :)', accessToken);

            return sendResultHTML(res, sessionData.integrationName, sessionData.userId, '', '');
        } catch (e) {
            return sendResultHTML(
                res,
                sessionData.integrationName,
                sessionData.userId,
                'token_retrieval_error',
                `Authentication failed: There was a problem exchanging the authorization code for an access token. Got this error: ${JSON.stringify(e)}`
            );
        }
    });

    app.listen(port);
}

function sendResultHTML(res: any, integrationName: string, userId: string, error: string | null, errorDesc: string | null) {
    const resultHTMLTemplate = `
<!--
Nango authorization callback. Read more about how to use it at: https://github.com/NangoHQ/nango
-->
<html>
  <head>
    <meta charset="utf-8" />
    <title>Authorization callback</title>
  </head>
  <body>
    <noscript>JavaScript is required to proceed with the authentication.</noscript>
    <script type="text/javascript">
      window.integrationName = '\${integrationName}';
      window.userId = '\${userId}';
      window.authError = '\${error}';
      window.authErrorDescription = '\${errorDesc}';

      const message = {};

      if (window.authError !== '') {
        message.eventType = 'AUTHORIZATION_FAILED';
        message.data = {
            userId: window.userId,
            integrationName: window.integrationName,
            error: {
                type: window.authError,
                message: window.authErrorDescription
            }
        };
      } else {
        console.log('I have success!');
        message.eventType = 'AUTHORIZATION_SUCEEDED';
        message.data = { userId: window.userId, integrationName: window.integrationName };
      }

      // Tell the world what happened
      window.opener && window.opener.postMessage(message, '*');

      // Close the modal
      window.setTimeout(function() {
        window.close()
      }, 300);
    </script>
  </body>
</html>
`;

    const resultHTML = core.interpolateString(resultHTMLTemplate, {
        integrationName: integrationName,
        userId: userId,
        error: error,
        errorDesc: errorDesc
    });

    if (error) {
        res.status(500);
    } else {
        res.status(200);
    }
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from(resultHTML));
}
