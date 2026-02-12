const Redis = require('ioredis');
require('dotenv').config();

module.exports = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});
