const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

module.exports = new Client({
  node: process.env.ELASTIC_URL
});
