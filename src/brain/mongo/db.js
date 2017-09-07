import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost/sdk-brain';

// Initialize Mongoose
export const connect = () => {
  mongoose.Promise = Promise;

  mongoose.connect(mongoUri, { useMongoClient: true }, (err) => {
    // Log if error
    if (err) {
      console.error('Could not connect to MongoDB!');
      console.log(err);
    }
  });
};

export const isConnected = () => mongoose.connection.readyState === 1;
