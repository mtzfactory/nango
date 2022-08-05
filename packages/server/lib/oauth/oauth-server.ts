/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import express from 'express';
import { IntegrationsManager } from '../integrations-manager.js';
import * as uuid from 'uuid';
import simpleOauth2 from 'simple-oauth2';
import { NangoIntegrationAuthConfigOAuth2, NangoIntegrationAuthModes, OAuthSession, OAuthSessionStore } from '@nangohq/core';
import * as core from '@nangohq/core';
import { getSimpleOAuth2ClientConfig, NangoOAuth1Client } from './oauth-clients.js';

const app = express();
const sessionStore: OAuthSessionStore = {};

export function startOAuthServer() {
    let serverRootUrl = IntegrationsManager.getInstance().getNangoConfig().oauth_server_root_url;
    serverRootUrl = serverRootUrl.slice(-1) !== '/' ? serverRootUrl + '/' : serverRootUrl;
    const oAuthCallbackUrl = serverRootUrl + 'oauth/callback';

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

        const authState = uuid.v1();
        sessionStore[authState] = {
            integrationName: integration,
            userId: userId as string,
            callbackUrl: oAuthCallbackUrl,
            authMode: integrationConfig.auth.auth_mode
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

        if (integrationConfig.auth.auth_mode === NangoIntegrationAuthModes.OAuth2) {
            const oAuth2AuthConfig = integrationConfig.auth as NangoIntegrationAuthConfigOAuth2;

            if (
                oAuth2AuthConfig.token_params === undefined ||
                oAuth2AuthConfig.token_params.grant_type === undefined ||
                oAuth2AuthConfig.token_params.grant_type === 'authorization_code'
            ) {
                let additionalAuthParams = {};
                if (integrationConfig.auth.authorization_params) {
                    additionalAuthParams = integrationConfig.auth.authorization_params;
                }

                const simpleOAuthClient = new simpleOauth2.AuthorizationCode(getSimpleOAuth2ClientConfig(integrationConfig));
                const authorizationUri = simpleOAuthClient.authorizeURL({
                    redirect_uri: oAuthCallbackUrl,
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
                    `Authentication failed: The grant type "${oAuth2AuthConfig.token_params.grant_type}" is not supported by this OAuth flow. Please check the documentation or contact support.`
                );
            }
        } else if (integrationConfig.auth.auth_mode === NangoIntegrationAuthModes.OAuth1) {
            // In OAuth 2 we are guaranteed that the state parameter will be sent back to us
            // for the entire journey. With OAuth 1.0a we have to register the callback URL
            // in a first step and will get called back there. We need to manually include the state
            // param there, otherwise we won't be able to identify the user in the callback
            const callbackParams = new URLSearchParams({
                state: authState
            });
            const oAuth1CallbackURL = `${oAuthCallbackUrl}?${callbackParams.toString()}`;

            const oAuth1Client = new NangoOAuth1Client(integrationConfig, oAuth1CallbackURL);

            oAuth1Client
                .getOAuthRequestToken()
                .then((tokenResult) => {
                    const sessionData = sessionStore[authState]!;
                    sessionData.request_token_secret = tokenResult.request_token_secret;

                    // All worked, let's redirect the user to the authorization page
                    res.redirect(oAuth1Client.getAuthorizationURL(tokenResult));
                })
                .catch((error) => {
                    return sendResultHTML(
                        res,
                        integration,
                        userId as string,
                        'oauth1_request_token',
                        `Authentication failed: The external server returned an error in the request token step of the OAuth 1.0a flow. Error: ${error}`
                    );
                });
        } else {
            return sendResultHTML(
                res,
                integration,
                userId,
                'unsupported_auth_mode',
                `Authentication failed: The integration "${integration}" is configured to use auth mode "${integrationConfig.auth.auth_mode}" which is not supported by this OAuth flow. Please check the documentation or contact support.`
            );
        }
    });

    app.get('/oauth/callback', async (req, res) => {
        const { state } = req.query;
        const sessionData = sessionStore[state as string] as OAuthSession;
        delete sessionStore[state as string];

        if (state === undefined || sessionData === undefined) {
            return sendResultHTML(
                res,
                sessionData.integrationName,
                sessionData.userId,
                'invalid_state_callback',
                `Authorization failed: The external server did not send a valid state parameter back in the callback. Got state: ${state}`
            );
        }

        const integrationConfig = IntegrationsManager.getInstance().getIntegrationConfig(sessionData.integrationName!);

        if (sessionData.authMode === NangoIntegrationAuthModes.OAuth2) {
            const { code } = req.query;

            if (!code) {
                let errorType = '';
                let errorMessage = '';
                const { error } = req.query;
                if (error) {
                    errorType = 'external_callback_error';
                    errorMessage = `Authorization failed: The external OAuth 2 server responded with error in the callback: ${error} => The full callback URI was: ${req.originalUrl}`;
                } else {
                    errorType = 'unknown_external_callback_error';
                    errorMessage = `Authorization failed: The external OAuth2 server did not provide an authorization code in the callback. Unfortunately no additional errors were reported by the server. The full callback URI was: ${req.originalUrl}`;
                }
                return sendResultHTML(res, sessionData.integrationName, sessionData.userId, errorType, errorMessage);
            }

            const simpleOAuthClient = new simpleOauth2.AuthorizationCode(getSimpleOAuth2ClientConfig(integrationConfig));

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
                    `Authentication failed: There was a problem exchanging the OAuth 2 authorization code for an access token. Got this error: ${JSON.stringify(
                        e
                    )}`
                );
            }
        } else if (sessionData.authMode === NangoIntegrationAuthModes.OAuth1) {
            const { oauth_token, oauth_verifier } = req.query;

            if (!oauth_token || !oauth_verifier) {
                let errorType = '';
                let errorMessage = '';
                const { error } = req.query;
                if (error) {
                    errorType = 'external_callback_error';
                    errorMessage = `Authorization failed: The external OAuth 1.0a server responded with error in the callback: ${error} => The full callback URI was: ${req.originalUrl}`;
                } else {
                    errorType = 'unknown_external_callback_error';
                    errorMessage = `Authorization failed: The external OAuth 1.0a server did not provide an oauth_token and/or an oauth_verifier in the callback. Unfortunately no additional errors were reported by the server. The full callback URI was: ${req.originalUrl}`;
                }
                return sendResultHTML(res, sessionData.integrationName, sessionData.userId, errorType, errorMessage);
            }

            const oauth_token_secret = sessionData.request_token_secret!;

            const oAuth1Client = new NangoOAuth1Client(integrationConfig, '');
            oAuth1Client
                .getOAuthAccessToken(oauth_token as string, oauth_token_secret, oauth_verifier as string)
                .then((accessTokenResult) => {
                    console.log('A miracle, got accesss tokens!', accessTokenResult);
                    return sendResultHTML(res, sessionData.integrationName, sessionData.userId, '', '');
                })
                .catch((error) => {
                    return sendResultHTML(
                        res,
                        sessionData.integrationName,
                        sessionData.userId,
                        'access_token_retrieval_error',
                        `Authentication failed: There was a problem exchanging the OAuth 1.0a request token for an access token. Got this error: ${error}`
                    );
                });
        } else {
            return sendResultHTML(
                res,
                sessionData.integrationName,
                sessionData.userId,
                'unsupported_auth_mode_callback',
                `Authentication failed: The callback was called with an unsupported auth mode. You are seeing ghosts, this should never ever happen. Please contact support, thanks! Got this mode: ${sessionData.authMode}`
            );
        }
    });

    app.listen(port);
}

function sendResultHTML(res: any, integrationName: string, userId: string, error: string | null, errorDesc: string | null) {
    const resultHTMLTemplate = `
<!--
Nango OAuth flow callback. Read more about how to use it at: https://github.com/NangoHQ/nango
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
