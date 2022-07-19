import type { NangoConnection } from '@nangohq/core';
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
    let table = this.db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?;`)
      .get('nango_connections');

    if (table === undefined) {
      this.setupDb();
    }
  }

  public registerConnection(
    userId: string,
    integration: string,
    oAuthAccessToken: string,
    additionalConfig?: object
  ) {
    this.db
      .prepare(
        `
        INSERT INTO nango_connections
        (uuid, integration, user_id, oauth_access_token, additional_config)
        VALUES (?, ?, ?, ?, ?)
    `
      )
      .run(
        uuid.v4(),
        integration,
        userId,
        oAuthAccessToken,
        JSON.stringify(additionalConfig)
      );
  }

  public getConnection(
    userId: string,
    integration: string
  ): NangoConnection | undefined {
    const rawConnection = this.db
      .prepare(
        'SELECT * FROM nango_connections WHERE integration = ? AND user_id = ?'
      )
      .get(integration, userId);

    if (rawConnection === undefined) {
      return undefined;
    }

    const connectionObject = {
      uuid: rawConnection.uuid,
      integration: rawConnection.integration,
      userId: rawConnection.user_id,
      oAuthAccessToken: rawConnection.oauth_access_token,
      additionalConfig: JSON.parse(rawConnection.additional_config)
    } as NangoConnection;

    return connectionObject;
  }

  /** -------------------- Private Methods -------------------- */

  private constructor() {}

  private setupDb() {
    this.db.exec(`
        CREATE TABLE nango_connections (
            uuid VARCHAR(36) NOT NULL,
            integration TEXT NOT NULL,
            user_id TEXT NOT NULL,
            oauth_access_token TEXT NOT NULL,
            additional_config TEXT,
            datecreated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
            lastmodified DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        PRIMARY KEY (uuid),
        UNIQUE (integration, user_id)
        );
        CREATE TRIGGER update_lastmodified_nango_connections
        AFTER UPDATE On nango_connections
        BEGIN
            UPDATE nango_connections SET lastmodiefied = STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW') WHERE uuid = NEW.uuid;
        END;
    `);
  }
}
