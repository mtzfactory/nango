/*
 * Copyright (c) 2022 Nango, all rights reserved.
 */

import { connect, Channel, Connection } from 'amqplib';
import {
    NangoMessageAction,
    NangoTriggerActionMessage,
    NangoRegisterConnectionMessage,
    NangoMessageHandlerResult,
    NangoMessage,
    NangoAuthCredentials,
    NangoUpdateConnectionCredentialsMessage,
    NangoUpdateConnectionConfigMessage,
    NangoConnectionPublic,
    NangoGetUserIdConnectionsMessage,
    NangoGetIntegrationConnectionsMessage
} from '@nangohq/core';
import * as core from '@nangohq/core';

export default class Nango {
    /** -------------------- Private Properties -------------------- */

    private sendQueueId = 'server_inbound';
    private connection?: Connection;
    private channel?: Channel;
    private receiveQueue?: string;
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
        credentials: NangoAuthCredentials,
        additionalConfig?: Record<string, unknown>
    ): Promise<NangoMessageHandlerResult<undefined>> {
        const msg = {
            integration: integration,
            userId: userId,
            credentials: credentials,
            additionalConfig: additionalConfig,
            action: NangoMessageAction.REGISTER_CONNECTION
        } as NangoRegisterConnectionMessage;

        return this.sendMessageToServer(msg);
    }

    public async updateConnectionCredentials(
        integration: string,
        userId: string,
        credentials: NangoAuthCredentials
    ): Promise<NangoMessageHandlerResult<undefined>> {
        const msg = {
            integration: integration,
            userId: userId,
            credentials: credentials,
            action: NangoMessageAction.UPDATE_CONNECTION_CREDENTIALS
        } as NangoUpdateConnectionCredentialsMessage;

        return this.sendMessageToServer(msg);
    }

    public async updateConnectionConfig(
        integration: string,
        userId: string,
        additionalConfig: Record<string, unknown>
    ): Promise<NangoMessageHandlerResult<undefined>> {
        const msg = {
            integration: integration,
            userId: userId,
            additionalConfig: additionalConfig,
            action: NangoMessageAction.UPDATE_CONNECTION_CONFIG
        } as NangoUpdateConnectionConfigMessage;

        return this.sendMessageToServer(msg);
    }

    public async getConnectionsForUserId(userId: string): Promise<NangoMessageHandlerResult<NangoConnectionPublic[]>> {
        const msg = {
            userId: userId,
            action: NangoMessageAction.GET_USER_ID_CONNECTIONS
        } as NangoGetUserIdConnectionsMessage;

        return this.sendMessageToServer(msg);
    }

    public async getConnectionsForIntegration(integration: string): Promise<NangoMessageHandlerResult<NangoConnectionPublic[]>> {
        const msg = {
            integration: integration,
            action: NangoMessageAction.GET_INTEGRATION_CONNECTIONS
        } as NangoGetIntegrationConnectionsMessage;

        return this.sendMessageToServer(msg);
    }

    public async triggerAction(
        integration: string,
        triggerAction: string,
        userId: string,
        input: Record<string, unknown>
    ): Promise<NangoMessageHandlerResult<any>> {
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
        this.channel?.consume(
            this.receiveQueue!,
            (msg) => {
                if (msg === null) {
                    return;
                }

                if (msg.properties.correlationId in this.correlationIdToPromise) {
                    const nangoMsg = JSON.parse(msg.content.toString()) as NangoMessageHandlerResult<any>;
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

    private async sendMessageToServer(nangoMsg: NangoMessage): Promise<NangoMessageHandlerResult<any>> {
        let correlationId: string = core.makeId(8);

        let promise = new Promise<NangoMessageHandlerResult<any>>((resolve, reject) => {
            this.correlationIdToPromise[correlationId] = { resolve: resolve, reject: reject };

            this.channel?.sendToQueue(this.sendQueueId, Buffer.from(JSON.stringify(nangoMsg), 'utf8'), {
                correlationId: correlationId,
                replyTo: this.receiveQueue
            });
        });

        return promise;
    }

    private async connectRabbit() {
        this.connection = await connect('amqp://' + this.nangoServerHost + ':' + this.nangoServerPort);

        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.sendQueueId);
        const queueResponse = await this.channel.assertQueue('', {
            exclusive: true
        });
        this.receiveQueue = queueResponse.queue;

        this.listenToReceiveQueue();
    }
}
