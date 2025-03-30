const amqp = require("amqplib");

const runProducer = async () => {
  try {
    const connection = await amqp.connect(`amqp://guest:guest@localhost`);
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    const message = "Hello RabbitMQ ";
    channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Message send:`, message);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().then().catch(console.error);
