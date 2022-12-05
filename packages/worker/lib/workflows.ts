import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './sync.activity.js';
import * as wf from '@temporalio/workflow';

const { syncActivity } = proxyActivities<typeof activities>({
    startToCloseTimeout: '5 minutes',
    retry: {
        initialInterval: '10 seconds',
        backoffCoefficient: 2,
        maximumAttempts: Infinity,
        maximumInterval: '5 minutes',
        nonRetryableErrorTypes: []
    }
});

export async function oneTimeSyncJob(args: { syncId: number }): Promise<void> {
    return await syncActivity(args.syncId);
}

export async function continuousSync(args: { syncId: number; frequency: number; friendlyName: string | undefined }) {
    await wf.executeChild(oneTimeSyncJob, {
        workflowId: `Job for Sync ${args.syncId} (${Date.now()})`,
        taskQueue: 'syncs',
        args: [args]
    });

    await wf.sleep(args.frequency * 60 * 1000); // Mins to Ms.

    await wf.continueAsNew<typeof continuousSync>(args);
}
