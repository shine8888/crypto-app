import axios from 'axios';
import { authHeader } from './auth-header';
import {
  INVESTMENT_URL,
  TRADING_URL,
  HISTORY_TRANSACTION_URL,
} from '../constants/services.constants';

const getMyInvestment = async (userId) => {
  const result = await axios.get(INVESTMENT_URL + `?userId=${userId}`, {
    headers: authHeader(),
  });
  return result.data.data;
};

const tradingToken = async (senderId, recipientId, amount, symbol, coinName) => {
  const result = await axios.post(TRADING_URL, {
    headers: authHeader(),
    senderId,
    recipientId,
    amount,
    symbol,
    coinName,
  });
  
  return result.data
};

const getTransactionHistory = async (userId, symbol, type, date, currentPage, limit) => {
  const result = await axios.get(
    `${HISTORY_TRANSACTION_URL}?userId=${userId}&symbol=${symbol}&type=${type}&date=${date}&currentPage=${currentPage}&limit=${limit}`, {
    headers: authHeader(),
  }
  );
  return result.data.data;
};

export default { getMyInvestment, tradingToken, getTransactionHistory };
