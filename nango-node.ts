import {connect, Channel, Connection} from 'amqplib'
import {readFileSync} from 'fs'
import * as yaml from 'js-yaml'
import { NangoConfig, NangoLoadConfigMessage, NangoMessageAction, NangoTriggerActionMessage, NangoRegisterConnectionMessage } from './nango-types.js';

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

    private parseConfig() {
        this.nangoConfig = yaml.load(readFileSync(this.configPath).toString()) as NangoConfig;
        this.nangoServerHost = this.nangoConfig.nango_server_host;
        this.nangoServerPort = this.nangoConfig.nango_server_port;
    }

    private loadConfig() {
        if (this.nangoConfig == null) { return; }

        const msg: NangoLoadConfigMessage = { 
            config: this.nangoConfig,
            action: NangoMessageAction.LOAD_CONFIG,
        };

        this.channel?.sendToQueue(this.sendQueueId, Buffer.from(JSON.stringify(msg)));
    }
}
