import express from 'express';
import * as controller from '../../controllers/investmentControllers/investment.controller';
import { verifyToken } from '../../middlewares/authJwt';

const router = express.Router();

router.route('/').get(verifyToken, controller.getMyInvestments);

export default router;
