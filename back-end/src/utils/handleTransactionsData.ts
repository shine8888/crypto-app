import { TRANSACTION_TYPE } from '../constants/Transactions.constants';
import { Transaction } from '../types/Transaction';
import mongoose from 'mongoose';
import moment from 'moment';

/**
 * Generate query when fetching transactions
 *
 * @param {string} symbol - Symbol of token/coin
 * @param {number} date - It should be a timestamp
 * @param {string} userId
 * @param {string} type
 * @returns {any}
 */
export const generateQuery = (
  symbol: string,
  date: number,
  userId: string,
  type: string
): any => {
  // Initialize query
  let combinedCondition = {};

  // User query condition
  const userCondition =
    type === TRANSACTION_TYPE.DEPOSIT ?
      { recipientId: new mongoose.Types.ObjectId(userId) }
      : type === TRANSACTION_TYPE.WITHDRAWAL ? { senderId: new mongoose.Types.ObjectId(userId) } :
        {
          $or: [
            { recipientId: new mongoose.Types.ObjectId(userId) },
            { senderId: new mongoose.Types.ObjectId(userId) },
          ],
        };

  // Symbol query
  if (symbol) combinedCondition = { ...combinedCondition, symbol };

  // Date query
  if (date) {
    const momentDate = moment.unix(Math.floor(date / 1000)).utc();

    const startDate = momentDate.startOf('date').valueOf();
    const endDate = momentDate.endOf('date').valueOf();

    combinedCondition = {
      ...combinedCondition,
      timestamps: {
        $gte: startDate,
        $lte: endDate,
      },
    };
  }

  combinedCondition = { ...combinedCondition, ...userCondition };

  return { $and: [combinedCondition] };
};

/**
 * Add type: DEPOSIT or WITHDRAWAL to all result
 *
 * @param {Transaction[]} data
 * @param {string} userId
 * @param {type} type
 * @returns {Transaction[]}
 */
export const handleTransactionsData = (
  data: Transaction[],
  userId: string,
  type: string,
): Transaction[] => {
  const handledData = data.map((d) => {
    if (
      d.recipientId.toString() ===
      new mongoose.Types.ObjectId(userId).toString()
    )
      return { ...d, type: TRANSACTION_TYPE.DEPOSIT };

    return { ...d, type: TRANSACTION_TYPE.WITHDRAWAL };
  });

  if (!type) return handledData as never as Transaction[];

  return handledData.filter((trx) => trx.type === type);
};
