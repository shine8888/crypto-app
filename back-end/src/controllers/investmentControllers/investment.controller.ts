import { Request, Response } from 'express';
import Coin from '../../models/Coins';
import Users from '../../models/Users';
import { getMutipleCoinPrices } from '../coinControllers/coin.controllers';
import { successHandler, errorHandler } from '../../middlewares/statusHandler';
import httpStatus from 'http-status';

/**
 * Get list of invested coins with symbol and price as sequence
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<any>}
 */
export const getMyInvestments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.query;

    // Get list of invested coins
    const { coins } = await Users.findOne({ _id: userId }, ['coins']).lean();
    const listInvest = await Coin.find({ _id: coins }).lean();
    const listSymbols = listInvest.map((i) => i.symbol);
    const listCoinNames = listInvest.map((i) => i.name);

    // Get prices of list invested coins
    const listPrices = (await getMutipleCoinPrices(listSymbols)).data.coins
      .filter((coin: any) => listCoinNames.includes(coin.name))
      .reduce((result: any, coin: any) => {
        return {
          ...result,
          [coin.symbol]: { price: Number(coin.price), iconUrl: coin.iconUrl },
        };
      }, {});

    // Mapping price with coin
    listInvest.map((e) => {
      e.price = listPrices[`${e.symbol}`].price;
      e.iconUrl = listPrices[`${e.symbol}`].iconUrl;
    });

    successHandler(res, httpStatus.OK, listInvest);
  } catch (error) {
    errorHandler({ message: 'An error occurs when fetch investments' }, res);
  }
};
