import express from 'express';
import CoinRoutes from './coins/coins';
import UserRoutes from './users/user';
import InvesmentRoutes from './investments/index';
import TransactionRoutes from './transacions/transactions';

const router = express.Router();

router.use('/coins', CoinRoutes);
router.use('/users', UserRoutes);
router.use('/investment', InvesmentRoutes);
router.use('/transactions', TransactionRoutes);

export default router;
