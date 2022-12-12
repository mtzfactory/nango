import type { ActivityInboundCallsInterceptor, ActivityExecuteInput } from '@temporalio/worker';
import { JobStatus, Job } from './models/job.model.js';
import jobService from './services/job.service.js';
import { syncsService, logger, analytics, Sync } from '@nangohq/core';
import type { Context } from '@temporalio/activity';
import type { SyncActivitySuccess } from './sync.activity.js';

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
        var sync: Sync | undefined | null;

        try {
            sync = await syncsService.readById(syncId);
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
                logger.error(`Job ${job.id} (Sync ID: ${syncId}) error: ${JSON.stringify(err)}`);
                throw err;
            }
        } finally {
            job.ended_at = new Date();
            job.attempt = this.ctx.info.attempt;
            if (typeof error === 'object' && error != null && error.name === 'SyncActivitySuccess') {
                let successObj: SyncActivitySuccess = error;
                let newRows = successObj.newRecordCount;
                let updatedRows = successObj.updatedRecordCount;
                let totalRows = successObj.totalObjectsFetched;

                job.status = JobStatus.SUCCEEDED;
                job.new_row_count = newRows;
                job.updated_row_count = updatedRows;
                job.total_row_count = totalRows;

                logger.info(`Job ${job.id} succeeded: ${newRows} new rows, ${updatedRows} updated rows, ${totalRows} total (Sync ID: ${syncId}).`);
            } else {
                job.status = JobStatus.FAILED;
                job.error_message = error.message;
                job.raw_error = JSON.stringify(error, Object.getOwnPropertyNames(error));

                logger.info(`Job ${job.id} failed on attempt ${job.attempt} (Sync ID: ${syncId}).`);
            }

            await jobService.updateJob(job);
            analytics.track('job_finished', { domain: analytics.urlToRootHost(sync?.url), succeeded: job.status == JobStatus.SUCCEEDED ? true : false });
        }
    }
}
