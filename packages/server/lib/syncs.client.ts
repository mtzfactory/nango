import { WorkflowClient, Connection } from '@temporalio/client';
import type { WorkflowStartOptions } from '@temporalio/client';
import type { Sync } from '@nangohq/core';
import { logger } from '@nangohq/core';

class syncsClient {
    client?: WorkflowClient;

    async connect() {
        const connection = await Connection.connect({
            address: process.env['TEMPORAL_ADDRESS'] || 'localhost:7233'
        });

        this.client = new WorkflowClient({
            connection
        });
    }

    async run(sync: Sync, frequency: number) {
        type WFType = ({ syncId, frequency, friendlyName }) => Promise<void>;
        await this.client?.start('continuousSync', {
            workflowId: `Sync ${sync.id}${sync.friendly_name ? ' - ' + sync.friendly_name : ''}`,
            taskQueue: 'syncs',
            args: [{ syncId: sync.id, frequency: frequency, friendlyName: sync.friendly_name }]
        } as WorkflowStartOptions<WFType>);

        logger.info(`New Sync created (ID: ${sync.id} - ${sync.friendly_name || sync.url}).`);
    }
}

export default new syncsClient();
