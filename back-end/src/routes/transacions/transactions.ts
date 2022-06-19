import express from 'express';
import * as controller from '../../controllers/transactionControllers/transaction.controllers';
import { verifyToken } from '../../middlewares/authJwt';

const router = express.Router();

router.route('/').get(verifyToken, controller.fetchTransactions);

export default router;
