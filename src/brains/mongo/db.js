const mongoose = require('mongoose');

// Initialize Mongoose
const connect = (uri) => {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost/sdk-brain';

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

const dropDatabase = () => {
  if (isConnected()) {
    return mongoose.connection.db.dropDatabase();
  }
  return Promise.resolve();
};

module.exports = { connect, isConnected, dropDatabase };
