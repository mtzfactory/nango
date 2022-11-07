import externalService from './services/external.service.js';
import jobService from './services/job.service.js';
import type { Sync } from '@nangohq/core';
import _ from 'lodash';
import dataService from './services/data.service.js';
import { syncsQueue, syncsService } from '@nangohq/core';
import { Job, JobStatus } from './models/job.model.js';
import { logger } from '@nangohq/core';

class SyncExecutor {
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

        try {
            let rawObjs = await externalService.getRawObjects(this.sync);

            if (rawObjs.length > 0) {
                await dataService.upsertFromList(rawObjs, this.sync);
            }

            this.succeed(rawObjs.length);
        } catch (err) {
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

    fail(error_message: string) {
        this.job.error_message = error_message;
        this.job.status = JobStatus.FAILED;
        this.job.ended_at = new Date();
        jobService.updateJob(this.job);
        logger.error(`Failed to run job with ID ${this.job.id} for sync with ID ${this.sync.id}. Error msg:\n\n${error_message}`);
    }
}

await syncsQueue.connect().then(() => {
    console.log(`✅ Nango Worker is on.`);

    syncsQueue.consume((syncId: number) => {
        syncsService.readById(syncId).then((sync: Sync | null) => {
            if (sync == null) {
                console.log("Unidentified sync ID received from 'syncs' queue.");
                return;
            }

            new SyncExecutor(sync).run();
        });
    });
});
