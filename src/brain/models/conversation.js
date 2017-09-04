import mongoose from 'mongoose';

/**
 * Conversation model
 */
const conversationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  metadata: {
    type: Object,
    validate: {
      validator: metadata => metadata instanceof Object,
      message: 'Error: conversation metadata is not an Object',
    },
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model('Conversation', conversationSchema);
