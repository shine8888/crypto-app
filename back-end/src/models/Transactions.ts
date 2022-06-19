import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Transaction = new Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    recipientId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      // It values should be: 'PENDING' || 'COMPLETED' || 'FAIL'
      type: String,
      required: true,
      default: 'PENDING',
      index: true,
    },
    timestamps: {
      type: Number,
      default: (new Date).getTime(),
    },
  },
  { timestamps: false },
);

export default mongoose.model('Transactions', Transaction);
