import express from 'express';
import * as controller from '../../controllers/coinControllers/coin.controllers';

const router = express.Router();

router.route('/list').get(controller.list);

router.route('/coin/:coinId').get(controller.getCoin);

router
  .route('/coin/:coinId/timePeriod/:timePeriod')
  .get(controller.getCoinStatus);

router.route('/exchanges').get(controller.getExchanges);

export default router;
