import express from 'express';
import * as controller from '../../controllers/userControllers/user.controllers';
import { verifyToken } from '../../middlewares/authJwt';

const router = express.Router();

router.route('/register').post(controller.register);

router.route('/login').post(controller.login);

router.route('/recover-password').post(controller.recoverPassword);

router.route('/verify-email').post(controller.verifyEmail);

router.route('/refresh-token').post(controller.refreshToken);

router.route('/sending-token').post(controller.sendingToken);

// This route for initializing amount of coin for users
router.route('/add-coin').post(controller.addCoin);

export default router;
