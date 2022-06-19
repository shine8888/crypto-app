import mongoose from 'mongoose';

const Token = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User',
  },
  expiredDate: {
    type: Number,
  },
});

export default mongoose.model('Tokens', Token);
