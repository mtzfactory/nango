import externalService from './services/external.service.js';
import jobService from './services/job.service.js';
import dataService from './services/data.service.js';
import { Job, JobStatus } from './models/job.model.js';
import { logger } from '@nangohq/core';
import type { Sync } from '@nangohq/core';
import schemaManager from './schema.manager.js';

export class SyncTask {
    sync: Sync;
    job: Job;

    constructor(sync: Sync) {
        this.sync = sync;
        this.job = {
            sync_id: this.sync.id!,
            started_at: new Date(),
            status: JobStatus.RUNNING
        };
    }

    async run() {
        let result = await jobService.createJob(this.job);

        if (Array.isArray(result) && result.length === 1 && result[0] != null && 'id' in result[0]) {
            this.job.id = result[0]['id'];
        } else {
            logger.error('Could not create new job.');
            return;
        }

        if (this.sync.id == null) {
            this.fail('Missing Sync ID to run job.');
            return;
        }

        try {
            // Make the request(s) to the external endpoint.
            let rawObjs = await externalService.getRawObjects(this.sync);

            if (rawObjs.length > 0) {
                // Insert row results in the DB.
                await dataService.upsertRawFromList(rawObjs, this.sync);
            }

            // Perform auto JSON-to-SQL schema mapping.
            if (this.sync.auto_mapping) {
                // Update the schema of the DB for new results.
                let flatObjects = await schemaManager.updateSyncSchemaAndFlattenObjects(
                    rawObjs.map((o) => o.data),
                    this.sync.id
                );
                // Insert flattened results in the DB.
                await dataService.upsertFlatFromList(flatObjects, this.sync);
            }

            this.succeed(rawObjs.length);
        } catch (err) {
            logger.error(`Failed to run job with ID ${this.job.id} for sync with ID ${this.sync.id}.`, err);
            this.fail(JSON.stringify(err));
        }
    }

    succeed(total_row_count: number) {
        this.job.status = JobStatus.SUCCEEDED;
        this.job.ended_at = new Date();
        this.job.total_row_count = total_row_count;
        jobService.updateJob(this.job);
        logger.info(`Successfully ran job with ID ${this.job.id} for sync with ID ${this.sync.id}: ${total_row_count} total rows.`);
    }

    fail(err: string) {
        this.job.error_message = err;
        this.job.status = JobStatus.FAILED;
        this.job.ended_at = new Date();
        jobService.updateJob(this.job);
    }
}
