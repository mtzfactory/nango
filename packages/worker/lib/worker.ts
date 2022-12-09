import './config.js';
import _ from 'lodash';
import { Worker, NativeConnection } from '@temporalio/worker';
import * as activities from './sync.activity.js';
import { createRequire } from 'module';
import { SyncActivityInboundInterceptor } from './sync.interceptor.js';

const connection = await NativeConnection.connect({
    address: process.env['TEMPORAL_ADDRESS'] || 'localhost:7233'
});

const worker = await Worker.create({
    connection: connection,
    workflowsPath: createRequire(import.meta.url).resolve('./workflows.js'),
    activities,
    taskQueue: 'syncs',
    interceptors: { activityInbound: [(ctx) => new SyncActivityInboundInterceptor(ctx)] },
    bundlerOptions: { ignoreModules: ['fs'] }
});

await worker.run();
