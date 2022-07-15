import {connect} from 'amqplib'
import {readFileSync} from 'fs'
import {dirname} from 'path'
import { fileURLToPath } from 'url';

async function connectRabbit() {
    const inboundSeverQueue = 'server_inbound';
    const rabbitConnection = await connect('amqp://localhost');

    const rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertQueue(inboundSeverQueue);

    return [rabbitChannel, rabbitConnection];
}

// Make sure cwd is always where the JS file resides
const __filename = fileURLToPath(import.meta.url);
process.chdir(dirname(__filename));

const jsonFileName = process.argv[2];
if (typeof jsonFileName !== "string") {
    console.log("Looks like you're doing it wrong, please call me like this: node msg-pusher.js <path-to-file.json>\nThank you!");
    process.exit();
}


const [rabbitChannel, rabbitConnection] = await connectRabbit();
rabbitChannel.sendToQueue("server_inbound", Buffer.from(readFileSync(jsonFileName)));

setTimeout(function() {
    rabbitConnection.close();
    process.exit(0)
}, 500);