import cron from 'node-cron';
import { syncsQueue, logger } from '@nangohq/core';
import { syncsService } from '@nangohq/core';
import type { Sync } from '@nangohq/core';

class Scheduler {
    public start() {
        // Run every minute.
        cron.schedule('0 * * * * *', () => {
            this.scheduleSyncJobs();
        });
    }

    scheduleSyncJobs() {
        syncsService.listOverdueSyncs().then((syncIds: Sync[]) => {
            for (var syncId of syncIds) {
                syncsQueue.publish(syncId.id!);
                logger.info(`Triggered new job for sync with ID ${syncId}.`);
            }
        });
    }
}

export default new Scheduler();
