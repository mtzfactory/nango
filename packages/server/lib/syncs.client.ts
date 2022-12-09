import { WorkflowClient, Connection } from '@temporalio/client';
import type { WorkflowStartOptions } from '@temporalio/client';
import { Sync, SyncStatus } from '@nangohq/core';
import { logger, analytics, syncsService } from '@nangohq/core';
import * as wf from '@temporalio/workflow';

// Unfortunately, the following queries and signals are duplicated with workflows.ts.
// But Temporal discourages importing modules in workflows (in this case 'core') to ensure determinism.
const manualTriggerSignal = wf.defineSignal('manualTriggerSignal');
const stateSignal = wf.defineSignal<[SyncStatus]>('stateSignal');

class SyncClient {
    client?: WorkflowClient;

    async connect() {
        const connection = await Connection.connect({
            address: process.env['TEMPORAL_ADDRESS'] || 'localhost:7233'
        });

        this.client = new WorkflowClient({
            connection
        });
    }

    async run(sync: Sync) {
        type WFType = ({ syncId, friendlyName, cronParser, frequencyInMs }) => Promise<void>;
        await this.client?.start('continuousSync', {
            workflowId: this.syncWorkflowId(sync),
            taskQueue: 'syncs',
            args: [
                {
                    syncId: sync.id,
                    friendlyName: sync.friendly_name,
                    cronParser: sync.cron != null ? { expression: sync.cron } : undefined,
                    frequencyInMs: sync.frequency != null ? sync.frequency * 60 * 1000 : undefined // minutes to milliseconds.
                }
            ]
        } as WorkflowStartOptions<WFType>);

        logger.info(`New Sync created (ID: ${sync.id} - ${sync.friendly_name || sync.url}).`);
        analytics.track('sync_created', { domain: analytics.urlToRootHost(sync.url) });
    }

    async cancel(sync: Sync) {
        const handle = this.client?.getHandle(this.syncWorkflowId(sync));
        await handle?.cancel();
        await syncsService.editSync(sync, { status: SyncStatus.STOPPED });
        logger.info(`Sync cancelled (ID: ${sync.id} - ${sync.friendly_name || sync.url}).`);
    }

    async pause(sync: Sync) {
        const handle = this.client?.getHandle(this.syncWorkflowId(sync));
        await handle?.signal<[SyncStatus]>(stateSignal, SyncStatus.PAUSED);
        await syncsService.editSync(sync, { status: SyncStatus.PAUSED });
        logger.info(`Sync paused (ID: ${sync.id} - ${sync.friendly_name || sync.url}).`);
    }

    async resume(sync: Sync) {
        const handle = this.client?.getHandle(this.syncWorkflowId(sync));
        await handle?.signal<[SyncStatus]>(stateSignal, SyncStatus.RUNNING);
        await syncsService.editSync(sync, { status: SyncStatus.RUNNING });
        logger.info(`Sync resumed (ID: ${sync.id} - ${sync.friendly_name || sync.url}).`);
    }

    async trigger(sync: Sync) {
        const handle = this.client?.getHandle(this.syncWorkflowId(sync));
        await handle?.signal(manualTriggerSignal);
        logger.info(`Sync triggered (ID: ${sync.id} - ${sync.friendly_name || sync.url}).`);
    }

    syncWorkflowId(sync: Sync) {
        return `sync-${sync.id}`;
    }
}

export default new SyncClient();
