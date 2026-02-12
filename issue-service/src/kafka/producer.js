const { Kafka, Partitioners } = require("kafkajs");

const kafka = new Kafka({
  clientId: "issue-service",
  brokers: [process.env.KAFKA_BROKER],
});


const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});


const topics = {
  CREATED: "issue_created",
  UPDATED: "issue_updated",
};


async function connectProducer() {
  await producer.connect();
}


async function publish(topic, data) {

  await producer.send({
    topic,
    messages: [
      { value: JSON.stringify(data) }
    ],
  });
}


module.exports = {
  connectProducer,
  publish,
  topics,
};
