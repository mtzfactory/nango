import {connect, Channel, Connection} from 'amqplib'
import {readFileSync} from 'fs'

export default class Nango
{
    /** -------------------- Private Properties -------------------- */

    private sendQueueId: string = 'server_inbound';
    private connection?: Connection;
    private channel?: Channel;
    private configPath: string;

    /** -------------------- Public Methods -------------------- */

    constructor(configPath: string)
    {
        this.configPath = configPath;
    }

    public async connect() {
        await this.connectRabbit();
        this.loadConfig(); 
    }

    public registerConnection(integrationId: string, userId: string, params: {}) {
        const json: string = JSON.stringify({
            messageType: "Register connection",
            actionId: integrationId,
            userId: userId,
            params: params
        });

        this.channel?.sendToQueue(this.sendQueueId, Buffer.from(json, 'utf8'))
    }

    public trigger(actionId: string, userId: string, params: {}) {
        const json: string = JSON.stringify({
            messageType: "Trigger action",
            actionId: actionId,
            userId: userId,
            params: params
        });

        this.channel?.sendToQueue(this.sendQueueId, Buffer.from(json, 'utf8'))
    }

    public close() {
        this.connection?.close();
    }

    /** -------------------- Private Methods -------------------- */

    private async connectRabbit() {
        this.connection = await connect('amqp://localhost');
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.sendQueueId);    
    }

    private loadConfig() {
        this.channel?.sendToQueue(this.sendQueueId, Buffer.from(readFileSync(this.configPath)));
    }
}
