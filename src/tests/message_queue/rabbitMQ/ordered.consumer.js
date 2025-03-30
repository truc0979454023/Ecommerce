"use strict";
const amqp = require("amqplib");

async function consumerOrderedMessage() {
  try {
    const connection = await amqp.connect(`amqp://guest:guest@localhost`);
    const channel = await connection.createChannel();

    const queueName = "ordered-queued-message";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    //Set prefetch to 1 ensure only one ack at a time
    channel.prefetch(1); //moi task vu duoc su ly cung 1 luc

    channel.consume(queueName, (message) => {
      const msg = message.content.toString();
      setTimeout(() => {
        channel.ack(message);
        console.log(`Processed:`, msg);
      }, Math.random() * 1000);
    });
  } catch (error) {
    console.error(error);
  }
}

consumerOrderedMessage().catch((error) => console.log(error));
