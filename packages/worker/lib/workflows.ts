import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './sync.activity.js';
import * as wf from '@temporalio/workflow';
import { ParserOptions, parseExpression } from 'cron-parser';

// Unfortunately, the following enum, queries and signals are duplicated with syncs.client.ts and sync.model.ts.
// But Temporal discourages importing modules in workflows (in this case 'core') to ensure determinism.
enum SyncStatus {
    RUNNING = 'RUNNING',
    PAUSED = 'PAUSED',
    STOPPED = 'STOPPED'
}

const futureScheduleQuery = wf.defineQuery('futureScheduleQuery'); // Query next invocations time.
const manualTriggerSignal = wf.defineSignal('manualTriggerSignal'); // Trigger child workflow manually.
const stateSignal = wf.defineSignal<[SyncStatus]>('stateSignal'); // Change the state.

const { syncActivity } = proxyActivities<typeof activities>({
    startToCloseTimeout: '60 minutes',
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

async function spawnChild(syncId: number, nextTime: string, invocation: number) {
    return wf.executeChild(oneTimeSyncJob, {
        args: [{ syncId: syncId }],
        taskQueue: 'syncs',
        workflowId: `job-for-sync${syncId}-inv-${invocation}-next-${nextTime}`
    });
}

export async function sleepUntil(futureDate: string) {
    const timeUntilDate = new Date(futureDate).getTime() - new Date().getTime();
    return wf.sleep(timeUntilDate);
}

export async function continuousSync(
    args: {
        syncId: number;
        friendlyName: string | undefined;
        cronParser?: {
            expression: string;
            options: ParserOptions;
        };
        frequencyInMs?: number;
    },
    invocations = 1
) {
    // Cron schedule has precedence over unaligned frequency, using 1h frequency if no scheduling info at all.
    args.frequencyInMs = args.frequencyInMs || 1000 * 60 * 60;

    wf.setHandler(manualTriggerSignal, () => spawnChild(args.syncId, nextTime.toString(), invocations++));
    var scheduleWorkflowState: string = SyncStatus.RUNNING;
    wf.setHandler(stateSignal, (state: SyncStatus) => void (scheduleWorkflowState = state));

    var nextTime: string;

    if (args.cronParser != null) {
        // Cron schedule.
        const interval = parseExpression(args.cronParser.expression, args.cronParser.options);
        nextTime = interval.next().toString();
    } else {
        // Unaligned frequency.
        nextTime = new Date(Date.now() + args.frequencyInMs).toString();
    }

    wf.setHandler(futureScheduleQuery, () => {
        return {
            nextRun: nextTime,
            timeLeft: new Date(nextTime).getTime() - new Date().getTime()
        };
    });

    try {
        await spawnChild(args.syncId, nextTime.toString(), invocations);

        await sleepUntil(nextTime);

        if (scheduleWorkflowState === SyncStatus.PAUSED) {
            await wf.condition(() => scheduleWorkflowState === SyncStatus.RUNNING);
        }

        await wf.continueAsNew<typeof continuousSync>(args, invocations + 1);
    } catch (err) {
        if (wf.isCancellation(err)) scheduleWorkflowState = SyncStatus.STOPPED;
        else throw err;
    }
}
