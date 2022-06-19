import { Request, Response } from 'express';
import User from '../../models/Users';
import bcrypt from 'bcryptjs';
import { sign, decode } from '../../utils/jwt';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import { successHandler, errorHandler } from '../../middlewares/statusHandler';
import { pick } from 'lodash';
import httpStatus from 'http-status';
import Coins from '../../models/Coins';
import {
  generateAndSaveRefreshToken,
  generateAccessToken,
} from '../../utils/generateToken';
import Token from '../../models/Token';
import { TRANSACTION_STATUS } from '../../constants/Transactions.constants';
import {
  createTransaction,
  updateStatusTransaction,
} from '../transactionControllers/transaction.controllers';
import mongooseConnection from '../../db/connect';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Set API key for SENDGRID
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

/**
 * Register new user
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get information from req body
    const { name, email, password } = req?.body;
    const user = await User.findOne({ email });

    // Check is user is existed
    if (user) return errorHandler({ message: 'User is existed' }, res);

    // Hassing password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Message for Welcome to Crypto News
    const msg = {
      from: 'quang.kieu@timeedit.com',
      to: email,
      subject: 'Crypto News - Verification Email',
      text: `Hello, thanks for registering on our website.
      Please click on the link below to verify your account:
      http://${req.headers.host}/verify-email?token=${newUser.token}
      `,
      html: `
      <h1>Hello ${name}</h1>
      <p>Thanks for registering on our website.</p>
      <p>Please click the link below to verify your account.</p>
      <a href="http://${req.headers.host}/verify-email?token=${newUser.token}">Verify Your Account</>
      `,
    };

    // Send message
    await sgMail.send(msg);

    // Save new user
    await newUser.save();

    successHandler(res, httpStatus.OK, pick(newUser, ['name', 'email']));
  } catch (error: any) {
    errorHandler(error, res);
  }
};

/**
 * Login
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get email, password from req body
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();

    // Check user is existed or not
    if (!user)
      return errorHandler(
        {
          message: 'You have type wrong email or password. Please try again!',
        },
        res
      );
    // Compare password
    if (!bcrypt.compareSync(password, user.password))
      return errorHandler(
        { message: 'You have type wrong email or password. Please try again!' },
        res
      );

    // Generate and save refresh token
    const refrToken = await generateAndSaveRefreshToken(user._id);

    successHandler(res, httpStatus.OK, {
      refreshToken: refrToken,
      accessToken: generateAccessToken(user.email, user.name),
      userId: user._id,
    });
  } catch (error) {
    errorHandler(
      {
        message: 'There is something wrong with sever. Please login again',
      },
      res
    );
  }
};

/**
 * Recovery password
 *
 * @param {Request} req
 * @param {Response} res
 */
export const recoverPassword = async (req: Request, res: Response) => {
  try {
    // Get email from req body
    const { email } = req.body;
    // Add token to recovery in User model
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          token: sign(
            { randomKey: crypto.randomBytes(10).toString('hex') },
            process.env.RESET_PASSWORD_KEY || '',
            { expiresIn: '1m' }
          ),
        },
      },
      { new: true }
    );
    // Check user existed or not
    if (!user) {
      errorHandler({ message: 'User not found' }, res);
    }

    // Prepare message and send the token to recover password
    const msg = {
      from: 'quang.kieu@timeedit.com',
      to: email,
      subject: 'Crypto News - Recover Your Password',
      text: `Hello, thanks for using our serivices.
    Please click on the link below to recover your password:
    http://${req.headers.host}/verify-email?token=${user.token}
    `,
      html: `
    <h1>Hello ${user.name}</h1>
    <p>Thanks for using our services.</p>
    <p>Please click the link below to recover your password:</p>
    <a href="http://${req.headers.host}/verify-email?token=${user.token}">Recover Your Password</>
    `,
    };

    // Send message
    await sgMail.send(msg);
    // save user
    await user.save();

    successHandler(res, httpStatus.OK, pick(user, ['_id', 'name', 'email']));
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * Verify email when register new user
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.query.token?.toString() || '';

    // Check the token was sent in email
    const data = decode(token, process.env.REGISTER_KEY || '');
    if (!data.expired) {
      return errorHandler(
        {
          message: 'The link has been out of date.Please get the new link',
        },
        res
      );
    }

    // Get the user
    const user = await User.findOneAndUpdate(
      { token },
      { $set: { token: null, isVerified: true } },
      { new: true }
    ).lean();

    // Check user exist
    if (!user) {
      return errorHandler({ message: 'User not found' }, res);
    }

    successHandler(res, httpStatus.OK, pick(user, ['_id', 'name', 'email']));
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * This function only for initilize amount of coin for user
 *
 * @param {Request} req
 * @returns {Promise<void>}
 */
export const addCoin = async (req: Request): Promise<void> => {
  const { userId, name, amount, symbol } = req.body;
  try {
    const user = await User.findOne({ _id: userId }).lean();
    const coin = new Coins({ userId, volumes: amount, symbol, name });
    const result = await coin.save();

    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { coins: user.coins.concat(result._id) } }
    );
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get refresh token when access token is expired
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Get refresh token from req body
    const { refreshToken: requestToken } = req.body;

    // Check the refresh token
    if (!requestToken)
      return errorHandler({ message: 'Refresh Token is required!' }, res);

    // Find the refresh token in database
    const refreshToken = await Token.findOne({ token: requestToken }).lean();

    // Check refresh token exist
    if (!refreshToken)
      return errorHandler({ message: 'Refresh Token is not existed!' }, res);

    // Check refresh token is expired or not
    if (refreshToken.expiredDate < new Date().getTime()) {
      await Token.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();
      return errorHandler(
        {
          message:
            'Refresh token was expired. Please make a new signin request',
        },
        res
      );
    }

    // Generate new access token
    const user = await User.findOne({ _id: refreshToken.userId }).lean();
    const accessToken = generateAccessToken(user.emai, user.name);

    successHandler(res, httpStatus.OK, {
      accessToken,
      refreshToken: refreshToken.token,
    });
  } catch (error) {
    errorHandler(
      { message: 'An error occured when get new access token.' },
      res
    );
  }
};

/**
 * This function for handle the process of trading token
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const sendingToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Get all data from req body
  const { senderId, recipientId, amount, symbol, coinName } = req.body;

  // Initialize the session for transaction
  const session = await mongooseConnection.startSession();
  session.startTransaction();

  try {
    // Create transaction
    const trx = await createTransaction(
      senderId,
      recipientId,
      amount,
      symbol,
      session
    );
    // Find sender and recipient
    const senders = await Coins.findOne({ userId: senderId, symbol }).lean();
    const recipient = await Coins.findOne({
      userId: recipientId,
      symbol,
    }).lean();

    // Update number of token in Coins
    await Coins.findByIdAndUpdate(
      senders._id,
      {
        volumes: senders.volumes - amount,
      },
      { session }
    );

    // Check if the recipient does not have the token yet
    // Then create it new
    if (!recipient) {
      const user = await User.findOne({ _id: recipientId }).lean();
      const coin = new Coins({
        userId: recipientId,
        volumes: amount,
        symbol,
        name: coinName,
      });
      const result = await coin.save({ session });

      await User.findOneAndUpdate(
        { _id: recipientId },
        { $set: { coins: user.coins.concat(result._id) } },
        { session }
      );
    } else {
      // If existed, update amount
      await Coins.findByIdAndUpdate(
        recipient._id,
        {
          volumes: recipient.volumes + amount,
        },
        { session }
      );
    }

    // Change the status of transaction
    trx &&
      (await updateStatusTransaction(
        trx._id,
        TRANSACTION_STATUS.COMPLETED,
        session
      ));

    // Commit the session transaction
    await session.commitTransaction();

    successHandler(res, httpStatus.OK);
  } catch (error) {
    await session.commitTransaction();
  } finally {
    // End the session
    session.endSession();
  }
};
