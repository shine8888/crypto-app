import axios from 'axios';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { errorHandler, successHandler } from '../../middlewares/statusHandler';
import * as Redis from 'redis';

// Initialize Redis Client
const RedisClient = Redis.createClient();

// URL and Headers for fetching data from CoinRanking API
const url = 'https://api.coinranking.com/v2/';
const headers = { 'x-access-token': `${process.env.COIN_RANKING_API_KEY}` };

/**
 *  Get all prices of list invested coins
 *
 * @param {string[]} listCoins
 * @returns {Promise<any>}
 */
export const getMutipleCoinPrices = async (
  listCoins: string[]
): Promise<any> => {
  // Render query for get data from API
  const renderQuery = listCoins.map((e) => `symbols[]=${e}`).join('&');
  try {
    // Open Redis connection and get data from Redis
    await RedisClient.connect();
    const redisData = await RedisClient.get('getMutipleCoinPrices');
    if (redisData) return JSON.parse(redisData);

    const result: any = await axios(`${url}coins?${renderQuery}`, {
      headers,
    });

    // Set data to Redis
    RedisClient.setEx('getMutipleCoinPrices', 600, JSON.stringify(result.data));

    return result.data;
  } catch (error) {
    throw error;
  } finally {
    // Close Redis connection
    await RedisClient.quit();
  }
};

/**
 * Get list coins as ranking order in CoinRanking API
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const list = async (req: Request, res: Response): Promise<void> => {
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  try {
    // Open Redis connection and get data from Redis
    await RedisClient.connect();
    const redisData = await RedisClient.get(`listCoins${limit}`);
    if (redisData)
      return successHandler(res, httpStatus.OK, JSON.parse(redisData));

    const result: any = await axios(`${url}coins?limit=${limit}`, {
      headers,
    });
    // Set data to Redis
    RedisClient.setEx(
      `listCoins${limit}`,
      600,
      JSON.stringify(result.data.data)
    );

    successHandler(res, httpStatus.OK, result.data.data);
  } catch (error) {
    errorHandler({ message: 'An error occurs when fetching list coins' }, res);
  } finally {
    // Close Redis connection
    await RedisClient.quit();
  }
};

/**
 * Get a coin from CoinRanking API
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const getCoin = async (req: Request, res: Response): Promise<void> => {
  const coinId = req.params.coinId;
  try {
    const result: any = await axios(`${url}coin/${coinId}`, {
      headers,
    });

    successHandler(res, httpStatus.OK, result.data.data);
  } catch (error) {
    errorHandler({ message: 'An error occurs when fetching coin' }, res);
  }
};

/**
 * Get full coin status from CoinRanking API : market cap, changing in period, price,...
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const getCoinStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { coinId, timePeriod } = req.params;
  try {
    // Open Redis connection and get data from Redis
    await RedisClient.connect();
    const redisData = await RedisClient.get(`getCoinStatus${timePeriod}`);
    if (redisData)
      return successHandler(res, httpStatus.OK, JSON.parse(redisData));

    const result: any = await axios(
      `${url}coin/${coinId}/history?timePeriod=${timePeriod}`,
      {
        headers,
      }
    );

    // Set data to Redis
    RedisClient.setEx(
      `getCoinStatus${timePeriod}`,
      600,
      JSON.stringify(result.data.data)
    );

    successHandler(res, httpStatus.OK, result.data.data);
  } catch (error) {
    errorHandler({ message: 'An error occurs when fetching coin status' }, res);
  } finally {
    // Close Redis connection
    await RedisClient.quit();
  }
};

/**
 * Get list exchanges as ranking order in CoinRanking API
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const getExchanges = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Open Redis connection and get data from Redis
    await RedisClient.connect();
    const redisData = await RedisClient.get('getExchanges');
    if (redisData)
      return successHandler(res, httpStatus.OK, JSON.parse(redisData));

    const result: any = await axios(
      'https://api.coingecko.com/api/v3/exchanges',
      {
        headers,
      }
    );

    // Set data to Redis
    RedisClient.setEx('getExchanges', 600, JSON.stringify(result.data));

    successHandler(res, httpStatus.OK, result.data);
  } catch (error) {
    errorHandler({ message: 'An error occurs when fetching exchanges' }, res);
  } finally {
    // Close Redis connection
    await RedisClient.quit();
  }
};
