import type { Sync } from '@nangohq/core';
import { Pizzly } from '@nangohq/pizzly-node';
import { logger } from '@nangohq/core';

class OAuthManager {
    pizzly: Pizzly | null;

    constructor() {
        this.pizzly = process.env['PIZZLY'] == null ? null : new Pizzly(process.env['PIZZLY']);
    }

    public async insertOAuthTokenIfNeeded(sync: Sync): Promise<Sync> {
        if (sync.pizzly_connection_id == null || sync.pizzly_provider_config_key == null || this.pizzly == null) {
            // TODO: or no environment variables (show error if some variable but no other).
            logger.debug(`No (or incomplete) Pizzly configuration for sync ${sync.id}.`);

            return sync;
        }

        let accessToken = await this.pizzly.accessToken(sync.pizzly_connection_id, sync.pizzly_provider_config_key);

        logger.debug(`Authenticating request for Pizzly provider ${sync.pizzly_provider_config_key} and connection ${sync.pizzly_connection_id}.`);

        sync.url = this.interpolateString(sync.url, { pizzlyAccessToken: accessToken });

        if (sync.headers != null) {
            sync.headers = this.traverseAndInsertToken(sync.headers, accessToken) as Record<string, string | number | boolean>;
        }

        if (sync.body != null) {
            sync.body = this.traverseAndInsertToken(sync.body, accessToken);
        }

        if (sync.query_params != null) {
            sync.query_params = this.traverseAndInsertToken(sync.query_params, accessToken) as Record<string, string>;
        }

        return sync;
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
