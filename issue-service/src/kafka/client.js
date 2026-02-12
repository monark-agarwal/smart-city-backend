const { Kafka } = require('kafkajs');
require('dotenv').config();

module.exports = new Kafka({
  clientId: 'issue-service',
  brokers: [process.env.KAFKA_BROKER]
});
