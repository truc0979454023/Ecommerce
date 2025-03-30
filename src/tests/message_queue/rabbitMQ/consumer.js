const amqp = require("amqplib");

const consumerQueue = async (queueName) => {
  try {
    const connection = await amqp.connect(`amqp://guest:guest@localhost`);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, {
      durable: true,
    });

    console.log(`waiting for messages...`);
    channel.consume(
      queueName,
      (msg) => {
        console.log(`Received message: ${queueName}::`, msg.content.toString());
      },
      {
        noAck: true, //dữ liệu xử lý rồi sẽ không gửi lại nữa
      }
    );

    // setTimeout(() => {
    //   connection.close();
    //   process.exit(0);
    // }, 500);
  } catch (error) {
    console.error(error);
  }
};
const queueName = "test-topic";
consumerQueue(queueName)
  .then(() => console.log(`Message consumer started ${queueName}`))
  .catch(console.error);
