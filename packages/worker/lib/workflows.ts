import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './sync.activity.js';
import * as wf from '@temporalio/workflow';

const { syncActivity } = proxyActivities<typeof activities>({
    startToCloseTimeout: '5 minutes'
});

export async function syncChildWorkflow(args: { syncId: number }): Promise<void> {
    return await syncActivity(args.syncId);
}

export async function syncParentWorkflow(args: { syncId: number; frequency: number }) {
    await wf.executeChild(syncChildWorkflow, {
        workflowId: 'syncJob-' + Date.now(),
        taskQueue: 'syncs',
        args: [args]
    });

    await wf.sleep(args.frequency * 60 * 1000); // Mins to Ms.

    await wf.continueAsNew<typeof syncParentWorkflow>(args);
}
