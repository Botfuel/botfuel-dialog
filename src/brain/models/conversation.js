import mongoose from 'mongoose';

/**
 * Conversation model
 */
const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  data: {
    type: Object,
    validate: {
      validator: data => data instanceof Object,
      message: 'Error: conversation data is not an Object',
    },
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('Conversation', conversationSchema);
