import { decode } from '../utils/jwt';
import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './statusHandler';

/**
 * Verify the token when user query
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Get token from headers
  const token = req.headers['x-access-token'] as string;

  // Check if there is no token
  if (!token)
    return errorHandler({ message: 'No token provided!' }, res);

  // Decode token
  const decoded = decode(token, process.env.REGISTER_KEY || '');

  // Check is token is valid
  if (!decoded.valid)
    return errorHandler(
      { message: 'Token has expired. Please login again!' },
      res,
    );

  next();
};
