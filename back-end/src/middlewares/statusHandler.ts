import { Response } from 'express';
import httpStatus from 'http-status';

/**
 * Handle success request and send back data with status code 200/201
 *
 * @param {Response} res
 * @param {number} status
 * @param [any] data
 */
export const successHandler = (res: Response, status: number, data?: any) => {
  const response = {
    status: status || httpStatus.OK,
    message: httpStatus[`${status}_MESSAGE`],
    data,
  };

  res.status(status);
  res.json(response);
};

/**
 *  Handle fail request and send back data with status code 500
 *
 * @param {any} err
 * @param {Response} res
 */
export const errorHandler = (err: any, res: Response) => {
  const response = {
    code: err.status || 500,
    message: err.message || err.text || httpStatus[err.status],
    errors: err.message,
    stack: err.stack,
  };

  res.status(err.status || 500);
  res.json(response);
};
