import jwt from 'jsonwebtoken';
import { Decode } from '../types/decode';

/**
 * Sign new token
 *
 * @param {object} object
 * @param {strign} privateKey
 * @param [jwt.SignOptions | undefined] options
 * @returns
 */
export function sign(
  object: Object,
  privateKey: string,
  options?: jwt.SignOptions | undefined,
): string {
  return jwt.sign(object, privateKey, options);
}

/**
 * Decode token
 *
 * @param {string} token
 * @param {string} privateKey
 * @returns {Decode}
 */
export function decode(token: string, privateKey: string): Decode {
  try {
    const decoded = jwt.verify(token, privateKey);
    return { valid: true, expired: false, decoded };
  } catch (error) {
    console.error('decode jwt token: ', error.message);
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    };
  }
}
