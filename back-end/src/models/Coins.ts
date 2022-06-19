import mongoose from 'mongoose';

const Coin = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  symbol: {
    type: String,
    required: true,
    index: true,
  },
  volumes: {
    type: Number,
    default: 0,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    index: true,
    ref: 'User',
  },
});

export default mongoose.model('Coins', Coin);
