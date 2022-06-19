import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ClientSession } from 'mongoose';
import { errorHandler, successHandler } from '../../middlewares/statusHandler';
import Transactions from '../../models/Transactions';
import { Transaction } from '../../types/Transaction';
import {
  generateQuery,
  handleTransactionsData,
} from '../../utils/handleTransactionsData';

/**
 * Create transactions when deposit or withdrawal
 *
 * @param {string} senderId
 * @param {string} recipientId
 * @param {number} amount
 * @param {string} symbol
 * @param {ClientSession} session
 * @returns {Promise<Transaction | undefined>}
 */
export const createTransaction = async (
  senderId: string,
  recipientId: string,
  amount: number,
  symbol: string,
  session: ClientSession,
): Promise<Transaction | undefined> => {
  try {
    // Create transaction when user trading
    const transaction = new Transactions({
      senderId,
      recipientId,
      amount,
      symbol,
    });
    const result: Transaction = transaction.save({ session });

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Update status of transaction: PENDING -> COMPLETED || PENDING -> FAIL
 *
 * @param {string} _id
 * @param {string} status
 * @param {ClientSession} session
 * @returns {Promise<void>}
 */
export const updateStatusTransaction = async (
  _id: string,
  status: string,
  session: ClientSession,
): Promise<void> => {
  try {
    await Transactions.findByIdAndUpdate(_id, { status }, { session }).exec();
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get transactions of user
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const fetchTransactions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Get params from request
  const { userId, symbol, type, date, limit, currentPage } = req.query;
  try {
    // Prepare query for get data from transactions table
    const query = generateQuery(
      symbol as string,
      Number(date),
      userId as string,
      type as string,
    );

    // Handle skip and limit for pagination
    const skip =
      currentPage && parseInt(currentPage as string, 10) > 0
        ? parseInt(currentPage as string, 10)
        : 1;
    const limitValue =
      limit && parseInt(limit as string, 10) > 0
        ? parseInt(limit as string, 10)
        : 10;
    const totalRecords = await Transactions.countDocuments(query).exec();

    // Query get transactions
    const result: Transaction[] = await Transactions.find(query)
      .skip((skip - 1) * limitValue)
      .limit(limitValue)
      .lean();

    // Add type: DEPOSIT or WITHDRAWAL for result
    const finalResult = handleTransactionsData(
      result,
      userId as string,
      type as string,
    );

    successHandler(res, httpStatus.OK, {
      transactions: finalResult,
      totalRecords,
    });
  } catch (error) {
    errorHandler({ message: 'An error occurs when fetching transaction' }, res);
    throw new Error(error);
  }
};
