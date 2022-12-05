import type { ActivityInboundCallsInterceptor, ActivityExecuteInput } from '@temporalio/worker';
import { JobStatus, Job } from './models/job.model.js';
import jobService from './services/job.service.js';
import { syncsService, logger } from '@nangohq/core';
import type { Context } from '@temporalio/activity';

export class SyncActivityInboundInterceptor implements ActivityInboundCallsInterceptor {
    ctx: Context;

    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    async execute(input: ActivityExecuteInput, next: any) {
        var error: any;
        let syncId = input.args[0] as number;
        let job: Job = {
            sync_id: syncId,
            started_at: new Date(),
            status: JobStatus.RUNNING
        };

        try {
            let sync = await syncsService.readById(syncId);

            if (sync != null) {
                job.sync_friendly_name = sync.friendly_name;
                let result = await jobService.createJob(job);
                job.id = result[0]['id'];

                logger.info(`Job ${job.id} started (Sync ID: ${sync.id}).`);
            }

            return await next(input);
        } catch (err) {
            error = err;

            if (typeof error !== 'object' || error == null || error.name !== 'SyncActivitySuccess') {
                throw err;
            }
        } finally {
            job.ended_at = new Date();
            job.attempt = this.ctx.info.attempt;
            if (typeof error === 'object' && error != null && error.name === 'SyncActivitySuccess') {
                job.status = JobStatus.SUCCEEDED;
                job.updated_row_count = error.updatedRecordCount;
                logger.info(`Job ${job.id} succeeded with ${error.updatedRecordCount} updated/inserted rows (Sync ID: ${syncId}).`);
            } else {
                job.status = JobStatus.FAILED;
                job.error_message = error.message;
                job.raw_error = JSON.stringify(error, Object.getOwnPropertyNames(error));
                logger.info(`Job ${job.id} failed (Sync ID: ${syncId}).`);
            }

            await jobService.updateJob(job);
        }
    }
}
