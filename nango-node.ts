import {connect, Channel, Connection} from 'amqplib'
import {readFileSync} from 'fs'
import * as yaml from 'js-yaml'
import { NangoConfig, NangoLoadConfigMessage, NangoMessageAction } from './nango-types.js';

export default class Nango
{
    /** -------------------- Private Properties -------------------- */

    private sendQueueId: string = 'server_inbound';
    private connection?: Connection;
    private channel?: Channel;
    private configPath: string;
    private nangoConfig?: NangoConfig;
    private nangoServerHost?: string;
    private nangoServerPort?: number;

    /** -------------------- Public Methods -------------------- */

    constructor(configPath: string)
    {
        this.configPath = configPath;
    }

    public async connect() {
        this.parseConfig();
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
        this.connection = await connect('amqp://' + this.nangoServerHost + ":" + this.nangoServerPort);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.sendQueueId);    
    }

    private parseConfig() {
        this.nangoConfig = yaml.load(readFileSync(this.configPath).toString()) as NangoConfig;
        this.nangoServerHost = this.nangoConfig.nango_server_host;
        this.nangoServerPort = this.nangoConfig.nango_server_port;
    }

    private loadConfig() {
        if (this.nangoConfig == null) { return; }

        const configMsg: NangoLoadConfigMessage = { 
            config: this.nangoConfig,
            action: NangoMessageAction.LOAD_CONFIG,
        };
        this.channel?.sendToQueue(this.sendQueueId, Buffer.from(JSON.stringify(configMsg)));
    }
}
