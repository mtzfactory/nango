import {Channel, connect, ConsumeMessage} from 'amqplib'

let inboundRabbitChannel: Channel;

function handleInboundMessage(msg: ConsumeMessage | null) {
    if (msg === null) {
        return; // Skipp non-existing messages (honestly no idea why we might get null here but supposedly it can happen)
    }

    const nangoMessage = JSON.parse(msg.content.toString());

    console.log(`Got a new message! Properties:\n${JSON.stringify(msg.properties)} \n\n\n\nContent:\n${JSON.stringify(nangoMessage)}`);

    // In reality we will do message handling here:

    // switch(nangoMessage.action) {
    //     case "LOAD_CONFIG":
    //
    //     default:
    //         throw new Error(`Received inbound server message with unknown action: ${nangoMessage.action}`);
    // }

    inboundRabbitChannel.ack(msg);
}

async function connectRabbit() {
    const inboundSeverQueue = 'server_inbound';
    const rabbitConnection = await connect('amqp://localhost');

    const rabbitChannel = await rabbitConnection.createChannel();
    await rabbitChannel.assertQueue(inboundSeverQueue);

    rabbitChannel.consume(inboundSeverQueue, handleInboundMessage);

    return rabbitChannel
}

// Alright, let's run!
inboundRabbitChannel = await connectRabbit();