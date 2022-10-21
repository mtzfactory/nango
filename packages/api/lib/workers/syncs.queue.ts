import type { Channel, Connection } from 'amqplib';
import { connect } from 'amqplib';

class SyncsQueue {
    channel?: Channel;
    queueName = 'syncs';
    connectionIdParam = 'connection_id';

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

    public consume(callback: (connectionId: number) => void) {
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

            if (payload == null || !(this.connectionIdParam in payload)) {
                console.log("Invalid RabbitMQ message from 'syncs' queue");
                return;
            }

            callback(payload[this.connectionIdParam]);

            if (this.channel != null) {
                this.channel.ack(msg);
            }
        });
    }
}

export default new SyncsQueue();
