const amqp = require("amqplib");

// const log = console.log;
// console.log = function () {
//   log.apply(console, [new Date()].concat(arguments));
// };

const runProducer = async () => {
  try {
    const connection = await amqp.connect(`amqp://guest:guest@localhost`);
    const channel = await connection.createChannel();

    const notificationExchange = "notificationExchange"; //notification direct
    const notiQueue = "notificationQueueProcess"; //assertQueue
    const notificationExChangeDLX = "notificationExChangeDLX";
    const notificationRoutingKeyDLX = "notificationRoutingKeyDLX";

    //1. create exchange
    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    //2. create queue
    const queueResult = await channel.assertQueue(notiQueue, {
      exclusive: false, //cho phep cac ket noi khac truy cap cung 1 luc hang doi
      deadLetterExchange: notificationExChangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    //3. bind Queue
    await channel.bindQueue(queueResult.queue, notificationExchange);

    //4. send message
    const message = "a new product";
    console.log(`Producder message::`, message);
    await channel.sendToQueue(queueResult.queue, Buffer.from(message), {
      expiration: "10000",
    });

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

runProducer().then().catch(console.error);
