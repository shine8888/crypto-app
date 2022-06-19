import {
  TRANSACTION_TYPE,
  TRANSACTION_STATUS,
} from '../constants/Transactions.constants';

export interface Transaction {
  _id: string;
  senderId: string;
  recipientId: string;
  symbol: string;
  amount: number;
  status: TRANSACTION_STATUS;
  type?: TRANSACTION_TYPE;
}
