import mongoose from '../db/connect';

export type Coin = {
  _id: mongoose.Types.ObjectId;
  name: string;
  symbol: string;
  volumes: number;
  totalMoneyInvest: number;
  userId: string;
};
