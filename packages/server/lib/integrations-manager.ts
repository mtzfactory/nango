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

    /** -------------------- Public Methods -------------------- */

    public static getInstance() {
        return this._instance || (this._instance = new this());
    }

    // Loads the nango-integrations folder and initializes the manager
    // To re-load a different folder just call this method again
    public init(serverRootDir: string) {
        const serverIntegrationsInstallMode = process.env['NANGO_INTEGRATIONS_INSTALL_MODE'];

        if (serverIntegrationsInstallMode === core.ServerNangoIntegrationsDirInstallMethod.NO_COPY) {
            this.nangoIntegrationsDirPath = path.join(serverRootDir, '/nango-integrations-compiled/nango-integrations');
        } else if (serverIntegrationsInstallMode === core.ServerNangoIntegrationsDirInstallMethod.LOCAL_COPY) {
            this.nangoIntegrationsDirPath = path.join(serverRootDir, '/src/nango-integrations');

            // Copy over nango-integrations dir
            const nangoIntegrationSourceDir = process.env['NANGO_INTEGRATIONS_PACKAGE_DIR'];

            if (nangoIntegrationSourceDir === undefined) {
                throw new Error(`Fatal server error, cannot bootstrap: NANGO_INTEGRATIONS_PACKAGE_DIR is not set.`);
            }

            fs.cpSync(nangoIntegrationSourceDir, path.join(serverRootDir, '/src'), {
                recursive: true
            });
        }

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
        return path.join(path.join(this.nangoIntegrationsDirPath, integration), action + '.action.js');
    }
}
