import mongoose from 'mongoose';

/**
 * User model
 */
const userSchema = new mongoose.Schema({
  botId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  conversations: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
  }],
  dialogs: [{
    type: Object,
    default: [],
  }],
  lastDialog: {
    type: Object,
    default: {},
  },
  responses: [{
    type: String,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// ensure uniqueness with both botId and userId by creating an index
userSchema.index({ botId: 1, userId: 1 }, { unique: true });

export default mongoose.model('User', userSchema);
