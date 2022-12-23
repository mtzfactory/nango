import externalService from './services/external.service.js';
import dataService from './services/data.service.js';
import { logger, syncsService, SyncStatus, analytics, Sync } from '@nangohq/core';
import schemaManager from './schema.manager.js';
import { JobStatus, Job } from './models/job.model.js';
import jobService from './services/job.service.js';
import { Context } from '@temporalio/activity';
import webhookService from './services/webhook.service.js';
import type { RawObject } from './models/raw_object.model.js';

export async function syncActivity(syncId: number): Promise<void> {
    let sync = await syncsService.readById(syncId);

    if (sync == null || sync.id == null) {
        logger.error(`Could not start job for Sync ${syncId} (Sync not found).`);
        return;
    }

    if (sync.status != SyncStatus.RUNNING) {
        logger.debug(`Not executing activity due to paused/cancelled Sync ${syncId}.`);
        return;
    }

    // Create Sync job.
    let job: Job = {
        sync_id: syncId,
        started_at: new Date(),
        status: JobStatus.RUNNING
    };
    job.sync_friendly_name = sync.friendly_name;
    let result = await jobService.createJob(job);
    job.id = result[0]['id'];
    logger.info(`Job ${job.id} started (Sync ID: ${sync.id}).`);

    try {
        // Make the request(s) to the external endpoint.
        let res = await externalService.getRawObjects(sync);
        let rawObjs = res[0];
        let pageCount = res[1];

        if (rawObjs.length == 0) {
            logger.info(`No object returned from external API request, no data to map & insert to DB.`);
            return;
        }

        // Insert row results in the DB.
        let { addedIds, deletedIds, updatedIds, objIds } = await dataService.upsertRawFromList(rawObjs, sync);

        // Perform auto JSON-to-SQL schema mapping.
        if (sync.auto_mapping == null || sync.auto_mapping) {
            // Update the schema of the DB for new results.
            let flatObjs = await schemaManager.updateSyncSchemaAndFlattenObjs(
                rawObjs.map((o: RawObject) => o.data),
                sync.metadata,
                sync
            );

            // Insert flattened results in the DB.
            await dataService.upsertFlatFromList(flatObjs, objIds, sync.metadata, sync, deletedIds);
        }

        let upsertMode = sync.unique_key != null;

        // Job succeeded: store all info related to synced data.
        job.ended_at = new Date();
        job.attempt = Context.current().info.attempt;
        job.status = JobStatus.SUCCEEDED;
        job.added_count = upsertMode ? addedIds.length : rawObjs.length;
        job.updated_count = upsertMode ? updatedIds.length : 0;
        job.deleted_count = deletedIds.length;
        job.fetched_count = rawObjs.length;
        job.unchanged_count = upsertMode ? rawObjs.length - addedIds.length - updatedIds.length : 0;
        job.page_count = pageCount;
        jobService.updateJob(job);

        webhookService.notifySuccess(sync, job, addedIds, updatedIds, deletedIds);

        let modeDesc = (upsertMode ? 'upsert' : 'overwrite') + ' mode';
        logger.info(
            `Job ${job.id} succeeded (Sync ID: ${syncId}): ${job.added_count} added, ${job.updated_count} updated, ${job.deleted_count} deleted, ${job.unchanged_count} unchanged, ${job.fetched_count} fetched, ${job.page_count} page(s) (${modeDesc}).`
        );

        trackJobFinished(sync, job);
    } catch (err: any) {
        // Job failed: store all info related to the error.
        job.ended_at = new Date();
        job.attempt = Context.current().info.attempt;
        job.status = JobStatus.FAILED;
        job.error_message = err.message.substring(0, 1000); // Limit error message size
        job.raw_error = JSON.stringify(err, Object.getOwnPropertyNames(err)).substring(0, 10000); // Limit error message size
        jobService.updateJob(job);

        webhookService.notifyError(sync, job);

        logger.info(`Job ${job.id} failed on attempt ${job.attempt} (Sync ID: ${syncId}).`);
        logger.error(`Job ${job.id} (Sync ID: ${syncId}) detailed error: ${err.message}`);

        trackJobFinished(sync, job);

        throw err; // For Temporal to interpret it as an error.
    }
}

function trackJobFinished(sync: Sync, job: Job) {
    analytics.track('job_finished', { domain: analytics.urlToRootHost(sync?.url), succeeded: job.status == JobStatus.SUCCEEDED ? true : false });
}
