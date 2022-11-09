import dataService from './services/data.service.js';
import { logger } from '@nangohq/core';

class SchemaManager {
    public async updateSyncSchemaAndFlattenObjects(objects: object[], syncId: number): Promise<object[]> {
        let flatObjects = this.flattenAllObjects(objects);

        let newSchema = this.computeLatestSqlSchema(flatObjects, syncId);
        let previousSchema = await this.fetchPreviousSqlSchema(syncId);
        let newColumns = this.computeMissingColumns(previousSchema, newSchema, syncId);

        await dataService.createSyncTableIfNeeded(syncId);
        await dataService.updateSyncSchema(newColumns, syncId);

        return flatObjects;
    }

    private flattenAllObjects(objects: object[]) {
        let results: object[] = [];

        for (var object of objects) {
            object = this.flattenAndRemoveNulls(object);
            results.push(object);
        }

        return results;
    }

    private computeLatestSqlSchema(flatObjects: object[], syncId: number): object {
        var schema = {};

        for (var object of flatObjects) {
            let individualSchema = this.detectTypes(object);
            this.appendToSchema(individualSchema, schema);
        }

        logger.debug(`New schema computed for latest Sync job (Sync ID: ${syncId}).`, { newSchema: schema });
        return schema;
    }

    private flattenAndRemoveNulls(object: object, prefix: string = '', result: object | null = null): object {
        result = result || {};

        for (var key in object) {
            if (!object.hasOwnProperty(key)) continue;

            if (typeof object[key] === 'object' && object[key] !== null) {
                this.flattenAndRemoveNulls(object[key], prefix + key, result);
            } else if (object[key] != null) {
                result[prefix.length > 0 ? prefix + '_' + key : key] = object[key]; // Reflect nested paths.
            }
        }

        return result;
    }

    private detectTypes(object: object): object {
        let result = {};

        for (var key in object) {
            result[key] = typeof object[key];
        }

        return result;
    }

    private appendToSchema(object: object, schema: object) {
        for (var key in object) {
            if (object[key] == null) {
                continue;
            }

            if (schema[key] == null) {
                schema[key] = object[key];
                continue;
            }

            // If type conflict (within the new objects), default to string type.
            if (typeof schema[key] !== typeof object[key]) {
                schema[key] = 'string';
            }
        }
    }

    private async fetchPreviousSqlSchema(syncId: number) {
        return dataService.fetchColumnInfo(dataService.tableNameForSync(syncId)).then((schema) => {
            logger.debug(`Previous schema fetched for latest Sync job (Sync ID: ${syncId}).`, { previousSchema: schema });
            return schema;
        });
    }

    private computeMissingColumns(previousSchema: object, newSchema: object, syncId: number): object {
        let newColumns = {};

        for (var key in newSchema) {
            if (!previousSchema.hasOwnProperty(key)) {
                newColumns[key] = newSchema[key];
            }
        }

        logger.debug(`Columns to add computed for latest Sync job (Sync ID: ${syncId}).`, { newColumns: newColumns });
        return newColumns;
    }
}

export default new SchemaManager();
