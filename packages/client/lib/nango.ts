import { connect, Channel, Connection, ConsumeMessage } from 'amqplib';
import {
  NangoMessageAction,
  NangoTriggerActionMessage,
  NangoRegisterConnectionMessage,
  NangoTriggerActionResponse
} from '@nangohq/core';

interface TriggerResponseCallback {
  (response: NangoTriggerActionResponse): void;
}

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

  public registerConnection(
    integration: string,
    userId: string,
    oAuthAccessToken: string,
    additionalConfig: Record<string, unknown>
  ) {
    const msg: NangoRegisterConnectionMessage = {
      integration: integration,
      userId: userId,
      oAuthAccessToken: oAuthAccessToken,
      additionalConfig: additionalConfig,
      action: NangoMessageAction.REGISTER_CONNECTION
    };

    this.sendChannel?.sendToQueue(
      this.sendQueueId,
      Buffer.from(JSON.stringify(msg), 'utf8')
    );
  }

  public async trigger(
    integration: string,
    triggerAction: string,
    userId: string,
    input: Record<string, unknown>,
    callback?: TriggerResponseCallback
  ) {
    const msg: NangoTriggerActionMessage = {
      integration: integration,
      triggeredAction: triggerAction,
      userId: userId,
      input: input,
      action: NangoMessageAction.TRIGGER_ACTION
    };

    var correlationId = generateUuid();

    this.receiveChannel?.consume(
      this.receiveQueueId,
      function (msg: ConsumeMessage | null) {
        if (msg?.properties.correlationId == correlationId) {
          if (callback != null) {
            callback({ content: JSON.parse(msg.content.toString()) });
          }
        }
      },
      {
        noAck: true
      }
    );

    this.sendChannel?.sendToQueue(
      this.sendQueueId,
      Buffer.from(JSON.stringify(msg), 'utf8'),
      {
        correlationId: correlationId,
        replyTo: this.receiveQueueId
      }
    );
  }

  public close() {
    this.connection?.close();
  }

  /** -------------------- Private Methods -------------------- */

  private async connectRabbit() {
    this.connection = await connect(
      'amqp://' + this.nangoServerHost + ':' + this.nangoServerPort
    );

    this.sendChannel = await this.connection.createChannel();
    await this.sendChannel.assertQueue(this.sendQueueId);

    this.receiveChannel = await this.connection.createChannel();
    await this.receiveChannel.assertQueue(this.receiveQueueId);
  }
}

function generateUuid() {
  return (
    Math.random().toString() +
    Math.random().toString() +
    Math.random().toString()
  );
}
