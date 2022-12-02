import dataService from './services/data.service.js';
import { logger } from '@nangohq/core';
import { parseJSON } from 'date-fns';
import { NangoColumnDataTypes } from './models/data.types.js';

class SchemaManager {
    public async updateSyncSchemaAndFlattenObjects(
        objects: object[],
        metadata: Record<string, string | number | boolean> | undefined,
        syncId: number
    ): Promise<object[]> {
        let flatObjects = this.flattenAllObjects(objects);
        flatObjects = this.detectDatesAndNumbers(flatObjects);

        let newSchema = this.computeLatestSqlSchema(flatObjects, syncId);
        let previousSchema = await this.fetchPreviousSqlSchema(syncId);
        let newColumns = this.computeMissingColumns(previousSchema, newSchema, metadata, syncId);

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

    private detectDatesAndNumbers(flatObjects: object[]) {
        for (var object of flatObjects) {
            for (var key in object) {
                if (typeof object[key] === 'string') {
                    let dateCandidate = parseJSON(object[key]);

                    if (this.isValidDate(dateCandidate)) {
                        object[key] = dateCandidate;
                    } else if (this.isNumeric(object[key])) {
                        object[key] = +object[key];
                    }
                }
            }
        }

        return flatObjects;
    }

    private isValidDate(date: any) {
        return date != null && Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date);
    }

    private isNumeric(str: string) {
        return !isNaN(+str);
    }

    private computeLatestSqlSchema(flatObjects: object[], syncId: number): object {
        var schema = {};

        for (var object of flatObjects) {
            let individualSchema = this.getIndividualSchema(object);
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

    private getIndividualSchema(object: object): object {
        let result = {};

        for (var key in object) {
            if (typeof object[key] === 'number') {
                result[key] = NangoColumnDataTypes.NUMBER;
            } else if (typeof object[key] === 'boolean') {
                result[key] = NangoColumnDataTypes.BOOLEAN;
            } else if (this.isValidDate(object[key])) {
                result[key] = NangoColumnDataTypes.DATE;
            } else {
                result[key] = NangoColumnDataTypes.STRING;
            }
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

    private computeMissingColumns(
        previousSchema: object,
        newSchema: object,
        metadata: Record<string, string | number | boolean> | undefined,
        syncId: number
    ): object {
        let newColumns = {};

        for (var key in newSchema) {
            if (!previousSchema.hasOwnProperty(key)) {
                newColumns[key] = newSchema[key];
            }
        }

        if (metadata != null) {
            let metadataSchema = this.getIndividualSchema(metadata);
            for (var key in metadataSchema) {
                if (!previousSchema.hasOwnProperty(key)) {
                    newColumns[key] = metadataSchema[key];
                }
            }
        }

        logger.debug(`Columns to add computed for latest Sync job (Sync ID: ${syncId}).`, { newColumns: newColumns });
        return newColumns;
    }
}

export default new SchemaManager();
