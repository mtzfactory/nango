import './config.js';
import _ from 'lodash';
import { Worker } from '@temporalio/worker';
import * as activities from './sync.activity.js';
import { createRequire } from 'module';

const worker = await Worker.create({
    workflowsPath: createRequire(import.meta.url).resolve('./workflows.js'),
    activities,
    taskQueue: 'syncs'
});

await worker.run();
