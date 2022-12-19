import type { ActivityInboundCallsInterceptor, ActivityExecuteInput } from '@temporalio/worker';
import type { Context } from '@temporalio/activity';

export class SyncActivityInboundInterceptor implements ActivityInboundCallsInterceptor {
    ctx: Context;

    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    async execute(input: ActivityExecuteInput, next: any) {
        try {
            return await next(input);
        } catch (err) {
        } finally {
        }
    }
}
