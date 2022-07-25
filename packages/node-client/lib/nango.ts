/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

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
    private correlationIdToPromise?: any = {};

    /** -------------------- Public Methods -------------------- */

    constructor(host?: string, port?: number) {
        this.nangoServerHost = host ? host : 'localhost';
        this.nangoServerPort = port ? port : 5672;
    }

    public async connect() {
        await this.connectRabbit();
    }

    public async registerConnection(
        integration: string,
        userId: string,
        oAuthAccessToken: string,
        additionalConfig?: Record<string, unknown>
    ): Promise<NangoMessageHandlerResult> {
        const msg = {
            integration: integration,
            userId: userId,
            oAuthAccessToken: oAuthAccessToken,
            additionalConfig: additionalConfig,
            action: NangoMessageAction.REGISTER_CONNECTION
        } as NangoRegisterConnectionMessage;

        return this.sendMessageToServer(msg);
    }

    public async triggerAction(integration: string, triggerAction: string, userId: string, input: Record<string, unknown>): Promise<NangoMessageHandlerResult> {
        const msg = {
            integration: integration,
            triggeredAction: triggerAction,
            userId: userId,
            input: input,
            action: NangoMessageAction.TRIGGER_ACTION
        } as NangoTriggerActionMessage;

        return this.sendMessageToServer(msg);
    }

    public close() {
        this.connection?.close();
    }

    /** -------------------- Private Methods -------------------- */

    private listenToReceiveQueue() {
        this.receiveChannel?.consume(
            this.receiveQueueId,
            (msg) => {
                if (msg === null) {
                    return;
                }

                if (msg.properties.correlationId in this.correlationIdToPromise) {
                    const nangoMsg = JSON.parse(msg.content.toString()) as NangoMessageHandlerResult;
                    const resolveRejectObj = this.correlationIdToPromise[msg.properties.correlationId];
                    delete this.correlationIdToPromise[msg.properties.correlationId];

                    if (nangoMsg.success) {
                        resolveRejectObj.resolve(nangoMsg.returnValue);
                    } else {
                        resolveRejectObj.reject(nangoMsg.errorMsg);
                    }
                }
            },
            {
                noAck: true
            }
        );
    }

    private async sendMessageToServer(nangoMsg: NangoMessage): Promise<NangoMessageHandlerResult> {
        let correlationId: string = core.makeId(8);

        let promise = new Promise<NangoMessageHandlerResult>((resolve, reject) => {
            this.correlationIdToPromise[correlationId] = { resolve: resolve, reject: reject };

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

        this.listenToReceiveQueue();
    }
}
