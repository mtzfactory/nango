import type { Sync } from '@nangohq/core';
import _ from 'lodash';
import { syncsQueue, syncsService } from '@nangohq/core';
import { SyncTask } from './sync.task.js';
import * as dotenv from 'dotenv';
import path from 'path';

console.log(path.resolve(process.cwd(), '.env'));
if (process.env['NANGO_SERVER_RUN_MODE'] !== 'DOCKERIZED') {
    dotenv.config({ path: '../../.env' });
}

await syncsQueue.connect().then(() => {
    console.log(`✅ Nango Worker is on.`);

    syncsQueue.consume((syncId: number) => {
        syncsService.readById(syncId).then((sync: Sync | null) => {
            if (sync == null) {
                console.log("Unidentified sync ID received from 'syncs' queue.");
                return;
            }

            new SyncTask(sync).run();
        });
    });
});
