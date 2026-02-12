const AWS = require('aws-sdk');
require('dotenv').config();

module.exports = new AWS.S3({
  endpoint: process.env.S3_ENDPOINT,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  s3ForcePathStyle:true,
  signatureVersion:'v4'
});
