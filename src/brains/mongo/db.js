const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/sdk-brains';

// Initialize Mongoose
const connect = () => {
  mongoose.Promise = Promise;

  mongoose.connect(mongoUri, { useMongoClient: true }, (err) => {
    // Log if error
    if (err) {
      console.error('Could not connect to MongoDB!');
      console.log(err);
    }
  });
};

const isConnected = () => mongoose.connection.readyState === 1;

module.exports = { connect, isConnected };
