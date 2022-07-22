import { connect, Channel, Connection } from 'amqplib';
import { NangoMessageAction, NangoTriggerActionMessage, NangoRegisterConnectionMessage, NangoMessageHandlerResult, NangoMessage } from '@nangohq/core';
import * as core from '@nangohq/core';

export default class Nango {
    /** -------------------- Private Properties -------------------- */

    private sendQueueId = 'server_inbound';
    private receiveQueueId = 'server_outbound';
    private connection?: Connection;
    private sendChannel?: Channel;
    private receiveChannel?: Channel;
    private nangoServerHost?: string;
    private nangoServerPort?: number;

    /** -------------------- Public Methods -------------------- */

    constructor(host: string, port?: number) {
        this.nangoServerHost = host;
        this.nangoServerPort = port ? port : 5672;
    }

    public async connect() {
        await this.connectRabbit();
    }

    public async registerConnection(
        integration: string,
        userId: string,
        oAuthAccessToken: string,
        additionalConfig: Record<string, unknown>
    ): Promise<NangoMessageHandlerResult> {
        const msg: NangoRegisterConnectionMessage = {
            integration: integration,
            userId: userId,
            oAuthAccessToken: oAuthAccessToken,
            additionalConfig: additionalConfig,
            action: NangoMessageAction.REGISTER_CONNECTION
        };

        return this.sendMessageToServer(msg);
    }

    public async trigger(integration: string, triggerAction: string, userId: string, input: Record<string, unknown>): Promise<NangoMessageHandlerResult> {
        const msg: NangoTriggerActionMessage = {
            integration: integration,
            triggeredAction: triggerAction,
            userId: userId,
            input: input,
            action: NangoMessageAction.TRIGGER_ACTION
        };

        return this.sendMessageToServer(msg);
    }

    public close() {
        this.connection?.close();
    }

    /** -------------------- Private Methods -------------------- */

    private async sendMessageToServer(nangoMsg: NangoMessage): Promise<NangoMessageHandlerResult> {
        let correlationId = core.makeId(8);
        let promise = new Promise<NangoMessageHandlerResult>((resolve, reject) => {
            this.receiveChannel?.consume(
                this.receiveQueueId,
                (msg) => {
                    if (msg === null) {
                        return;
                    }

                    if (msg?.properties.correlationId == correlationId) {
                        const nangoMsg = JSON.parse(msg.content.toString()) as NangoMessageHandlerResult;

                        if (nangoMsg.success) {
                            resolve(nangoMsg.returnValue);
                        } else {
                            reject(nangoMsg.errorMsg);
                        }
                    }
                },
                {
                    noAck: true
                }
            );

            this.sendChannel?.sendToQueue(this.sendQueueId, Buffer.from(JSON.stringify(nangoMsg), 'utf8'), {
                correlationId: correlationId,
                replyTo: this.receiveQueueId
            });
        });

        return promise;
    }

    private async connectRabbit() {
        this.connection = await connect('amqp://' + this.nangoServerHost + ':' + this.nangoServerPort);

        this.sendChannel = await this.connection.createChannel();
        await this.sendChannel.assertQueue(this.sendQueueId);

        this.receiveChannel = await this.connection.createChannel();
        await this.receiveChannel.assertQueue(this.receiveQueueId);
    }
}
