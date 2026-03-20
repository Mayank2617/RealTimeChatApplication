const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    trim: true,
  },
  receiver: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
