import type { Channel, Connection } from 'amqplib';
import { connect } from 'amqplib';
import _ from 'lodash';

class SyncsQueue {
    channel?: Channel;
    queueName = 'syncs';

    public async connect() {
        return new Promise<void>((resolve, reject) => {
            connect(process.env['CLOUDAMQP_URL'] || 'amqp://localhost:5672')
                .then(async (conn: Connection) => {
                    return conn
                        .createChannel()
                        .then((ch: Channel) => {
                            this.channel = ch;
                            resolve();
                        })
                        .catch(function (err) {
                            reject(err);
                        });
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    public consume(callback: (syncId: number) => void) {
        if (this.channel == null) {
            console.log('RabbitMQ not connected.');
            return;
        }

        this.channel.assertQueue(this.queueName);
        this.channel.consume(this.queueName, (msg) => {
            if (msg == null || msg.content == null) {
                console.log("Invalid RabbitMQ message from 'syncs' queue");
                return;
            }

            let payload = JSON.parse(msg.content.toString());

            if (payload == null || _.toInteger(payload) == null) {
                console.log("Invalid RabbitMQ message from 'syncs' queue");
                return;
            }

            callback(_.toInteger(payload));

            if (this.channel != null) {
                this.channel.ack(msg);
            }
        });
    }

    public async publish(syncId: number): Promise<any> {
        if (this.channel == null) {
            console.log('RabbitMQ not connected.');
            return;
        }

        return this.channel.sendToQueue(this.queueName, Buffer.from(JSON.stringify(syncId), 'utf8'));
    }
}

export default new SyncsQueue();
