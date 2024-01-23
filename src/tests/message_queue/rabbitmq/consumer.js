const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send message to consumer channel
        channel.consume(queueName, (messages) => {
            console.log(`Received ${messages.content.toString()} messages`);
        }, {
            noAck: true
        })
    } catch (error) {
        console.error(error);
    }
}

runConsumer().catch(console.error)