/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import type { NangoConfig, NangoIntegrationsConfig, NangoIntegrationConfig, NangoIntegrationsYamlIntegrationConfig, NangoBlueprint } from '@nangohq/core';
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
    private blueprints_directory = 'blueprints';

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

        if (!integrationConfig) {
            throw new Error(`Requested integrationConfig for integration which does not exist: "${integrationName}`);
        }

        return this.resolveIntegrationConfig(integrationConfig);
    }

    public actionExists(integration: string, action: string): boolean {
        return fs.existsSync(this.getActionFilePath(integration, action));
    }

    public async getActionModule(integration: string, action: string) {
        // If we are not in prod append a random query string to make sure import does not cache the module
        // Currently this is the only way to invalidate the import cache in node and is required for our hot-reloading to work.
        // Otherwise node will cache the imported module and use the cached version instead of the recompiled one
        // See issue here: https://github.com/nodejs/modules/issues/307
        let actionFilePath = this.getActionFilePath(integration, action);
        if (process.env['NODE_ENV'] !== 'production') {
            actionFilePath = actionFilePath + `?v=${Math.random().toString(36).substring(3)}`;
        }

        const actionModule = await import(actionFilePath);
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

    private resolveIntegrationConfig(sourceConfig: NangoIntegrationsYamlIntegrationConfig): NangoIntegrationConfig {
        // No blueprint used -> YAML config = fully specified config
        if (!sourceConfig.extends_blueprint) {
            return sourceConfig as NangoIntegrationConfig;
        }

        // Load the blueprint
        let blueprintName;
        let blueprintVersion = undefined;
        if (sourceConfig.extends_blueprint.includes(':')) {
            [blueprintName, blueprintVersion] = sourceConfig.extends_blueprint.split(':');
        } else {
            blueprintName = sourceConfig.extends_blueprint;
        }
        const blueprintPath = path.join(path.join(process.env['NANGO_SERVER_ROOT_DIR']!, this.blueprints_directory), `${blueprintName}.yaml`);
        const blueprint = yaml.load(fs.readFileSync(blueprintPath).toString()) as NangoBlueprint;

        // Sort the versions in the blueprint DESC
        blueprint.versions.sort((a, b) => {
            const vA = Object.keys(a)[0]!;
            const vB = Object.keys(b)[0]!;
            if (vA < vB) {
                return 1;
            } else if (vA > vB) {
                return -1;
            } else {
                return 0;
            }
        });

        if (!blueprintVersion) {
            blueprintVersion = Object.keys(blueprint.versions[0]!)[0];
        }

        let blueprintConfig = undefined;
        for (const versionConfig of blueprint.versions) {
            const versionName = Object.keys(versionConfig)[0]!;
            if (versionName === blueprintVersion) {
                blueprintConfig = versionConfig[versionName];
            }
        }

        if (!blueprintConfig) {
            throw new Error(
                `Invalid blueprint config: Could not find a configuration for version "${blueprintVersion}" of blueprint "${blueprintName}" in the blueprint file "${blueprintPath}". The file or blueprint version may not exist or the configuration may be malformed. Raw YAML data that was loaded from file:\n${JSON.stringify(
                    blueprint
                )}`
            );
        }

        const finalConfig = {
            auth: sourceConfig.auth ? sourceConfig.auth : blueprintConfig.auth,
            requests: sourceConfig.requests ? sourceConfig.requests : blueprintConfig.requests
        } as any;

        // Add all the other keys also present in sourceConfig
        let sourceConfigKeys = Object.keys(sourceConfig);
        sourceConfigKeys = sourceConfigKeys.filter((elem) => {
            return elem !== 'auth' && elem !== 'requests';
        });
        for (const key of sourceConfigKeys) {
            finalConfig[key] = (sourceConfig as any)[key]; // A bit of a dirty hack to make TypeScript happy
        }

        return finalConfig as NangoIntegrationConfig;
    }
}
