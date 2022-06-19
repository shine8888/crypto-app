import mongoose from 'mongoose';

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  coins: {
    type: [mongoose.Types.ObjectId],
    default: [],
  },
});

export default mongoose.model('Users', User);
