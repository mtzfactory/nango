/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { NangoAuthCredentials, NangoConnection, NangoIntegrationAuthModes } from '@nangohq/core';
import * as uuid from 'uuid';
import DatabaseConstructor, { Database } from 'better-sqlite3';

export class ConnectionsManager {
    /** -------------------- Private Properties -------------------- */
    private static _instance: ConnectionsManager;
    private db!: Database;

    /** -------------------- Public Methods -------------------- */

    public static getInstance() {
        return this._instance || (this._instance = new this());
    }

    public init(dbFilePath: string) {
        this.db = new DatabaseConstructor(dbFilePath);

        // Check if the table exists, if not create it
        let table = this.db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`).get('nango_connections');

        if (table === undefined) {
            this.setupDb();
        }
    }

    public insertOrUpdateConnection(
        userId: string,
        integration: string,
        credentials: object,
        authMode: NangoIntegrationAuthModes,
        additionalConfig?: Record<string, unknown>
    ) {
        if (!this.getConnection(userId, integration)) {
            this.insertConnection(userId, integration, credentials, authMode, additionalConfig);
        } else {
            this.updateConnectionCredentials(userId, integration, credentials, authMode);
            if (additionalConfig) {
                this.updateConnectionConfig(userId, integration, additionalConfig);
            }
        }
    }

    public updateConnectionCredentials(userId: string, integration: string, credentials: object, authMode: NangoIntegrationAuthModes) {
        const existingConnection = this.getConnection(userId, integration);
        if (!existingConnection) {
            throw new Error(`Tried to update connection for userId "${userId}" and integration "${integration}" but this connection does not exist`);
        }

        // Compute new credentials
        const newCredentials = JSON.stringify(this.parseRawCredentials(credentials, authMode));

        this.db
            .prepare(
                `
        UPDATE nango_connections
        SET
            credentials = ?
        WHERE uuid = ?
    `
            )
            .run(newCredentials, existingConnection.uuid);
    }

    public updateConnectionConfig(userId: string, integration: string, additionalConfig: Record<string, unknown>) {
        const existingConnection = this.getConnection(userId, integration);
        if (!existingConnection) {
            throw new Error(`Tried to update connection for userId "${userId}" and integration "${integration}" but this connection does not exist`);
        }

        // Compute new config
        const newConfig = JSON.stringify(additionalConfig);

        this.db
            .prepare(
                `
        UPDATE nango_connections
        SET
            additional_config = ?
        WHERE uuid = ?
    `
            )
            .run(newConfig, existingConnection.uuid);
    }

    public insertConnection(
        userId: string,
        integration: string,
        credentials: object,
        authMode: NangoIntegrationAuthModes,
        additionalConfig?: Record<string, unknown>
    ) {
        let newAdditionalConfig: string;
        if (additionalConfig === undefined || additionalConfig === null) {
            newAdditionalConfig = JSON.stringify({});
        } else {
            newAdditionalConfig = JSON.stringify(additionalConfig);
        }
        const parsedCredentials = JSON.stringify(this.parseRawCredentials(credentials, authMode));

        this.db
            .prepare(
                `
        INSERT INTO nango_connections
        (uuid, integration, user_id, credentials, additional_config)
        VALUES (?, ?, ?, ?, ?)
    `
            )
            .run(uuid.v4(), integration, userId, parsedCredentials, newAdditionalConfig);
    }

    public getConnection(userId: string, integration: string): NangoConnection | undefined {
        const rawConnection = this.db.prepare('SELECT * FROM nango_connections WHERE integration = ? AND user_id = ?').get(integration, userId);

        if (rawConnection === undefined) {
            return undefined;
        }

        const connectionObject = {
            uuid: rawConnection.uuid,
            integration: rawConnection.integration,
            userId: rawConnection.user_id,
            dateCreated: rawConnection.dateCreated,
            lastModified: rawConnection.lastModified,
            credentials: this.parseCredentials(rawConnection.credentials),
            additionalConfig: JSON.parse(rawConnection.additional_config)
        } as NangoConnection;

        return connectionObject;
    }

    public getConnectionsForUserId(userId: string): NangoConnection[] {
        const rawConnections = this.db.prepare('SELECT * FROM nango_connections WHERE user_id = ?').all(userId);

        let connections: NangoConnection[] = [];
        for (const rawConnection of rawConnections) {
            const connectionObject = {
                uuid: rawConnection.uuid,
                integration: rawConnection.integration,
                userId: rawConnection.user_id,
                dateCreated: rawConnection.datecreated,
                lastModified: rawConnection.lastmodified,
                credentials: this.parseCredentials(rawConnection.credentials),
                additionalConfig: JSON.parse(rawConnection.additional_config)
            } as NangoConnection;
            connections.push(connectionObject);
        }

        return connections;
    }

    public getConnectionsForIntegration(integration: string): NangoConnection[] {
        const rawConnections = this.db.prepare('SELECT * FROM nango_connections WHERE integration = ?').all(integration);

        let connections: NangoConnection[] = [];
        for (const rawConnection of rawConnections) {
            const connectionObject = {
                uuid: rawConnection.uuid,
                integration: rawConnection.integration,
                userId: rawConnection.user_id,
                dateCreated: rawConnection.datecreated,
                lastModified: rawConnection.lastmodified,
                credentials: this.parseCredentials(rawConnection.credentials),
                additionalConfig: JSON.parse(rawConnection.additional_config)
            } as NangoConnection;
            connections.push(connectionObject);
        }

        return connections;
    }

    // Parses and arbitrary object (e.g. a server response or a user provided auth object) into NangoAuthCredentials.
    // Throws if values are missing/missing the input is malformed.
    public parseRawCredentials(rawCredentials: object, authMode: NangoIntegrationAuthModes): NangoAuthCredentials {
        const rawAuthCredentials = rawCredentials as Record<string, any>; // Otherwise TS complains

        let parsedCredentials: any = {};
        switch (authMode) {
            case NangoIntegrationAuthModes.OAuth2:
                parsedCredentials.type = NangoIntegrationAuthModes.OAuth2;
                parsedCredentials.accessToken = rawAuthCredentials['access_token'];
                if (rawAuthCredentials['refresh_token']) {
                    parsedCredentials.refreshToken = rawAuthCredentials['refresh_token'];
                    let tokenExpirationDate: Date;
                    if (rawAuthCredentials['expires_at']) {
                        tokenExpirationDate = this.parseTokenExpirationDate(rawAuthCredentials['expires_at']);
                    } else if (rawAuthCredentials['expires_in']) {
                        tokenExpirationDate = new Date(Date.now() + Number.parseInt(rawAuthCredentials['expires_in'], 10) * 1000);
                    } else {
                        throw new Error(`Got a refresh token but no information about expiration: ${JSON.stringify(rawAuthCredentials, undefined, 2)}`);
                    }
                    parsedCredentials.expiresAt = tokenExpirationDate;
                }
                break;
            case NangoIntegrationAuthModes.OAuth1:
                parsedCredentials.type = NangoIntegrationAuthModes.OAuth1;
                parsedCredentials.oAuthToken = rawAuthCredentials['oauth_token'];
                parsedCredentials.oAuthTokenSecret = rawAuthCredentials['oauth_token_secret'];
                break;
            case NangoIntegrationAuthModes.ApiKey:
                parsedCredentials.type = NangoIntegrationAuthModes.ApiKey;
                parsedCredentials.apiKey = rawAuthCredentials['api_key'];
                break;
            case NangoIntegrationAuthModes.UsernamePassword:
                parsedCredentials.type = NangoIntegrationAuthModes.UsernamePassword;
                parsedCredentials.username = rawAuthCredentials['username'];
                parsedCredentials.password = rawAuthCredentials['password'];
                break;
            default:
                throw new Error(`Cannot parse credentials, unknown credentials type: ${JSON.stringify(rawAuthCredentials, undefined, 2)}`);
        }
        parsedCredentials.raw = rawAuthCredentials;

        // Checks if the credentials are well formed, if not it will throw
        const parsedNangoAuthCredentials = this.checkCredentials(parsedCredentials);

        return parsedNangoAuthCredentials;
    }

    /** -------------------- Private Methods -------------------- */

    private constructor() {}

    private parseCredentials(rawCredentials: string): NangoAuthCredentials {
        const credentialsObj = JSON.parse(rawCredentials);
        return credentialsObj as NangoAuthCredentials;
    }

    private checkCredentials(rawCredentials: object): NangoAuthCredentials {
        const rawAuthCredentials = rawCredentials as NangoAuthCredentials;
        if (!rawAuthCredentials.type) {
            throw new Error(`Cannot parse credentials, has no property "type" which is required: ${JSON.stringify(rawAuthCredentials, undefined, 2)}`);
        }

        switch (rawAuthCredentials.type) {
            case NangoIntegrationAuthModes.OAuth2:
                if (!rawAuthCredentials.accessToken) {
                    throw new Error(
                        `Cannot parse credentials, OAuth2 access token credentials must have "access_token" property: ${JSON.stringify(
                            rawAuthCredentials,
                            undefined,
                            2
                        )}`
                    );
                } else if (rawAuthCredentials.refreshToken && !rawAuthCredentials.expiresAt) {
                    throw new Error(
                        `Cannot parse credentials, if OAuth2 access token credentials have a "refresh_token" property the "expires_at" property must also be set: ${JSON.stringify(
                            rawAuthCredentials,
                            undefined,
                            2
                        )}`
                    );
                }
                break;
            case NangoIntegrationAuthModes.OAuth1:
                if (!rawAuthCredentials.oAuthToken || !rawAuthCredentials.oAuthTokenSecret) {
                    throw new Error(
                        `Cannot parse credentials, OAuth1 credentials must have both "oauth_token" and "oauth_token_secret" property: ${JSON.stringify(
                            rawAuthCredentials,
                            undefined,
                            2
                        )}`
                    );
                }
                break;
            case NangoIntegrationAuthModes.ApiKey:
                if (!rawAuthCredentials.apiKey) {
                    throw new Error(
                        `Cannot parse credentials, ApiKey credentials must have "api_key" property: ${JSON.stringify(rawAuthCredentials, undefined, 2)}`
                    );
                }
                break;
            case NangoIntegrationAuthModes.UsernamePassword:
                if (!rawAuthCredentials.username || !rawAuthCredentials.password) {
                    throw new Error(
                        `Cannot parse credentials, Username & password credentials must have both "username" and "password" property: ${JSON.stringify(
                            rawAuthCredentials,
                            undefined,
                            2
                        )}`
                    );
                }
                break;
            default:
                throw new Error(`Cannot parse credentials, unknown credentials type: ${JSON.stringify(rawAuthCredentials, undefined, 2)}`);
        }

        return rawAuthCredentials;
    }

    private parseTokenExpirationDate(expirationDate: any): Date {
        if (expirationDate instanceof Date) {
            return expirationDate;
        }

        // UNIX timestamp
        if (typeof expirationDate === 'number') {
            return new Date(expirationDate * 1000);
        }

        // ISO 8601 string
        return new Date(expirationDate);
    }

    private setupDb() {
        this.db.exec(`
        CREATE TABLE nango_connections (
            uuid VARCHAR(36) NOT NULL,
            integration TEXT NOT NULL,
            user_id TEXT NOT NULL,
            credentials TEXT NOT NULL,
            additional_config TEXT,
            datecreated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            lastmodified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (uuid),
        UNIQUE (integration, user_id)
        );
        CREATE TRIGGER update_lastmodified_nango_connections
        AFTER UPDATE On nango_connections
        BEGIN
            UPDATE nango_connections SET lastmodified = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE uuid = NEW.uuid;
        END;
    `);
    }
}
