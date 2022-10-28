import type { Channel, Connection } from 'amqplib';
import { connect } from 'amqplib';
import _ from 'lodash';

class SyncsQueue {
    channel?: Channel;
    queueName = 'syncs';

    public async connect(connectionTries = 0) {
        return new Promise<void>((resolve, reject) => {
            let amqp_host = process.env['NANGO_SERVER_RABBIT_HOST'] || 'localhost';
            let amqp_port = process.env['NANGO_SERVER_RABBIT_PORT'] || '5672';
            let amqp_url = `amqp://${amqp_host}:${amqp_port}`;
            connect(amqp_url)
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
                .catch((error) => {
                    connectionTries += 1;

                    if (connectionTries < 10) {
                        console.log(`RabbitMQ connection failure: ${error}\nWill retry ${10 - connectionTries} more times, next in 5 seconds...`);
                        setTimeout(() => {
                            this.connect(connectionTries);
                        }, 5000);
                    } else {
                        reject(error);
                    }
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
