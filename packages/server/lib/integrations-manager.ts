import type { NangoConfig, NangoIntegrationsConfig, NangoIntegrationConfig } from '@nangohq/core';
import * as core from '@nangohq/core';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

export class IntegrationsManager {
    /** -------------------- Private Properties -------------------- */
    private static _instance: IntegrationsManager;

    private nangoIntegrationsDirPath!: string;

    private nangoConfig!: NangoConfig;
    private integrationsConfig!: NangoIntegrationsConfig;

    private nangoConfigFile = 'nango-config.yaml';
    private integrationsConfigFile = 'integrations.yaml';

    private fsNangoConfigTimeout: NodeJS.Timeout | null = null;
    private fsIntegrationsConfigTimeout: NodeJS.Timeout | null = null;

    /** -------------------- Public Methods -------------------- */

    public static getInstance() {
        return this._instance || (this._instance = new this());
    }

    // Sets the path for the compiled nango-integrations folder depending on the server run mode
    // Also loads the config files
    public init(serverRootDir: string) {
        const ServerRunMode = process.env['NANGO_SERVER_RUN_MODE'];

        if (ServerRunMode === core.ServerRunMode.LOCAL_DEV) {
            this.nangoIntegrationsDirPath = path.join(serverRootDir, '/nango-integrations');
        } else if (ServerRunMode === core.ServerRunMode.DOCKERIZED) {
            this.nangoIntegrationsDirPath = '/usr/nango-server/src/nango-integrations';
        }

        fs.watch(this.nangoIntegrationsDirPath, {}, (_, filename) => {
            if (filename) {
                if (filename === this.nangoConfigFile && !this.fsNangoConfigTimeout) {
                    this.reloadNangoConfig();
                    console.log("❗️ 'nango-config.yaml' has been edited. Please restart the server's Docker container to apply these changes.");
                    this.fsNangoConfigTimeout = setTimeout(() => {
                        this.fsNangoConfigTimeout = null;
                    }, 1000);
                } else if (filename === this.integrationsConfigFile && !this.fsIntegrationsConfigTimeout) {
                    this.reloadIntegrationsConfig();
                    this.fsIntegrationsConfigTimeout = setTimeout(() => {
                        this.fsIntegrationsConfigTimeout = null;
                    }, 1000);
                }
            }
        });

        this.reloadNangoConfig();
        this.reloadIntegrationsConfig();

        this.nangoConfig = yaml.load(fs.readFileSync(path.join(this.nangoIntegrationsDirPath, 'nango-config.yaml')).toString()) as NangoConfig;

        this.integrationsConfig = yaml.load(
            fs.readFileSync(path.join(this.nangoIntegrationsDirPath, 'integrations.yaml')).toString()
        ) as NangoIntegrationsConfig;
    }

    public getNangoConfig() {
        return this.nangoConfig;
    }

    public getIntegrationConfig(integrationName: string): NangoIntegrationConfig {
        let integrationConfig = undefined;
        for (const integration of this.integrationsConfig.integrations) {
            const currentIntegrationName = Object.keys(integration)[0];
            if (currentIntegrationName === integrationName) {
                integrationConfig = integration[integrationName];
            }
        }

        return integrationConfig as NangoIntegrationConfig;
    }

    public actionExists(integration: string, action: string): boolean {
        return fs.existsSync(this.getActionFilePath(integration, action));
    }

    public async getActionModule(integration: string, action: string) {
        const actionModule = await import(this.getActionFilePath(integration, action));
        const key = Object.keys(actionModule)[0] as string;
        return actionModule[key];
    }

    /** -------------------- Private Methods -------------------- */

    private constructor() {}

    private getActionFilePath(integration: string, action: string): string {
        return path.join(path.join(path.join(this.nangoIntegrationsDirPath, 'dist'), integration), action + '.action.js');
    }

    private reloadNangoConfig() {
        this.nangoConfig = yaml.load(fs.readFileSync(path.join(this.nangoIntegrationsDirPath, this.nangoConfigFile)).toString()) as NangoConfig;
    }

    private reloadIntegrationsConfig() {
        this.integrationsConfig = yaml.load(
            fs.readFileSync(path.join(this.nangoIntegrationsDirPath, this.integrationsConfigFile)).toString()
        ) as NangoIntegrationsConfig;
    }
}
