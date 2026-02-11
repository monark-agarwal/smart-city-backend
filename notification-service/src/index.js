const { run } = require('./kafka/consumer');run().then(()=>console.log('Notification Service running'));
