import type { Sync } from '@nangohq/core';
import { logger } from '@nangohq/core';
import { Pizzly } from '@nangohq/pizzly-node';

class OAuthManager {
    pizzly: Pizzly | null;

    constructor() {
        this.pizzly = process.env['PIZZLY_BASE_URL'] == null ? null : new Pizzly(process.env['PIZZLY_BASE_URL']);
    }

    public async insertOAuthTokenIfNeeded(sync: Sync): Promise<Sync> {
        let syncCp = sync;

        if (syncCp.pizzly_connection_id == null || syncCp.pizzly_provider_config_key == null || this.pizzly == null) {
            logger.debug(`No (or incomplete) Pizzly configuration for sync ${syncCp.id}.`);

            return syncCp;
        }

        let accessToken = await this.pizzly.accessToken(syncCp.pizzly_connection_id, syncCp.pizzly_provider_config_key);

        logger.debug(`Authenticating request for Pizzly provider ${syncCp.pizzly_provider_config_key} and connection ${syncCp.pizzly_connection_id}.`);

        syncCp.url = this.interpolateString(syncCp.url, { pizzlyAccessToken: accessToken });

        if (syncCp.headers != null) {
            syncCp.headers = this.traverseAndInsertToken(syncCp.headers, accessToken) as Record<string, string | number | boolean>;
        }

        if (syncCp.body != null) {
            syncCp.body = this.traverseAndInsertToken(syncCp.body, accessToken);
        }

        if (syncCp.query_params != null) {
            syncCp.query_params = this.traverseAndInsertToken(syncCp.query_params, accessToken) as Record<string, string>;
        }

        return syncCp;
    }

    private traverseAndInsertToken(object: object, accessToken: string) {
        for (var key in object) {
            if (!object.hasOwnProperty(key)) continue;

            if (typeof object[key] === 'object' && object[key] !== null) {
                object[key] = this.traverseAndInsertToken(object[key], accessToken);
            } else if (object[key] != null && (typeof object[key] === 'string' || object[key] instanceof String)) {
                object[key] = this.interpolateString(object[key], { pizzlyAccessToken: accessToken });
            }
        }

        return object;
    }

    // A helper function to interpolate a string.
    // Example:
    // interpolateString('Hello ${name} of ${age} years", {name: 'Tester', age: 234})
    // Copied from https://stackoverflow.com/a/1408373/250880
    private interpolateString(str: string, replacers: Record<string, any>) {
        return str.replace(/\${([^{}]*)}/g, (a, b) => {
            var r = replacers[b];
            return typeof r === 'string' || typeof r === 'number' ? (r as string) : a; // Typecast needed to make TypeScript happy
        });
    }
}

export default new OAuthManager();
