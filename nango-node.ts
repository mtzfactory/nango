import {connect, Channel, Connection} from 'amqplib'
import { NangoMessageAction, NangoTriggerActionMessage, NangoRegisterConnectionMessage } from './nango-types.mjs';

export default class Nango
{
    /** -------------------- Private Properties -------------------- */

    private sendQueueId: string = 'server_inbound';
    private connection?: Connection;
    private channel?: Channel;
    private nangoServerHost?: string;
    private nangoServerPort?: number;

    /** -------------------- Public Methods -------------------- */

    constructor(host: string, port?: number)
    {
        this.nangoServerHost = host;
        this.nangoServerPort = (port) ? port : 5672;
    }

    public async connect() {
        await this.connectRabbit();
    }

    public registerConnection(integration: string, userId: string, oAuthAccessToken: string, additionalConfig: {}) {
        const msg: NangoRegisterConnectionMessage = {
            integration: integration,
            userId: userId,
            oAuthAccessToken: oAuthAccessToken,
            additionalConfig: additionalConfig,
            action: NangoMessageAction.REGISTER_CONNECTION,
        };

        this.channel?.sendToQueue(this.sendQueueId, Buffer.from(JSON.stringify(msg), 'utf8'))
    }

    public trigger(integration: string, triggerAction: string, userId: string, input: {}) {
        const msg: NangoTriggerActionMessage = {
            integration: integration,
            triggeredAction: triggerAction,
            userId: userId,
            input: input,
            action: NangoMessageAction.TRIGGER_ACTION,
        };

        this.channel?.sendToQueue(this.sendQueueId, Buffer.from(JSON.stringify(msg), 'utf8'))
    }

    public close() {
        this.connection?.close();
    }

    /** -------------------- Private Methods -------------------- */

    private async connectRabbit() {
        this.connection = await connect('amqp://' + this.nangoServerHost + ":" + this.nangoServerPort);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.sendQueueId);    
    }

}
