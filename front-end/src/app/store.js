import { configureStore } from '@reduxjs/toolkit';
import { cryptoApi } from '../services/cryptoAPI';
import { cryptoNews } from '../services/cryptoNews';
import authReducer from '../slices/auth.slice';
import messageReducer from '../slices/message.slice';
import investmentReducer from '../slices/investments.slice';
import transactionReducer from '../slices/transactions.slice';

export default configureStore({
  reducer: {
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [cryptoNews.reducerPath]: cryptoNews.reducer,
    auth: authReducer,
    message: messageReducer,
    investment: investmentReducer,
    transaction: transactionReducer,
  },
});
