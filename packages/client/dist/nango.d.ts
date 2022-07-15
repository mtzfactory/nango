export default class Nango {
    /** -------------------- Private Properties -------------------- */
    private sendQueueId;
    private connection?;
    private channel?;
    private nangoServerHost?;
    private nangoServerPort?;
    /** -------------------- Public Methods -------------------- */
    constructor(host: string, port?: number);
    connect(): Promise<void>;
    registerConnection(integration: string, userId: string, oAuthAccessToken: string, additionalConfig: Record<string, unknown>): void;
    trigger(integration: string, triggerAction: string, userId: string, input: Record<string, unknown>): void;
    close(): void;
    /** -------------------- Private Methods -------------------- */
    private connectRabbit;
}
