import { Connection, WorkflowClient } from '@temporalio/client';
import { nanoid } from 'nanoid';
import type { WorkflowStartOptions } from '@temporalio/client';

class syncsClient {
    client?: WorkflowClient;

    async connect() {
        const connection = await Connection.connect();

        this.client = new WorkflowClient({
            connection
        });
    }

    async run(syncId: number, frequency: number) {
        type WFType = ({ syncId, frequency }) => Promise<void>;
        const handle = await this.client?.start('syncParentWorkflow', {
            workflowId: 'sync-' + nanoid(),
            taskQueue: 'syncs',
            args: [{ syncId: syncId, frequency: frequency }]
        } as WorkflowStartOptions<WFType>);
        console.log(`Started workflow ${handle?.workflowId}`);

        return await handle?.result();
    }
}

export default new syncsClient();
