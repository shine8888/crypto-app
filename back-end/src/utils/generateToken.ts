import { v4 as uuidv4 } from 'uuid';
import authConfigs from '../configs/auth.configs';
import Token from '../models/Token';
import { sign } from './jwt';
import crypto from 'crypto';

/**
 * Generate and save the refresh token
 *
 * @param {string} userId
 * @returns {Promise<string>}
 */
export const generateAndSaveRefreshToken = async (
  userId: string,
): Promise<string> => {
  // Get the expried date
  const expiredDate = new Date();

  // Add time to expired date
  expiredDate.setSeconds(
    expiredDate.getSeconds() + authConfigs.jwtRefreshExpiration,
  );

  // Create new token
  const newToken = new Token({
    token: uuidv4(),
    userId,
    expiredDate: expiredDate.getTime(),
  });

  // Save token
  const refreshToken = await newToken.save();

  return refreshToken.token;
};

/**
 * Generate access token
 *
 * @param {string} email
 * @param {string} name
 * @returns {string}
 */
export const generateAccessToken = (email: string, name: string): string => {
  return sign(
    { randomKey: crypto.randomBytes(64).toString('hex'), email, name },
    process.env.REGISTER_KEY || '',
    { expiresIn: '1d' },
  );
};
