const MongoClient = require('mongodb').MongoClient;

// Initialize MongoDB
const connect = (uri) => {
  const mongoUri = uri || process.env.MONGODB_URI || 'mongodb://localhost/sdk-brain';
  return MongoClient.connect(mongoUri);
};

const drop = (uri) => {
  connect(uri).then(db => db.dropDatabase());
};

module.exports = { connect, drop };
