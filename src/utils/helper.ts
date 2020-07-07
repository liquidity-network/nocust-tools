import { fetchTokenBalance } from '../utils/web3Utils';
import { db } from '../utils/firebase';
import BigNumber from 'bignumber.js';

const getTokensBalances = async (
  tokens: Array<any>,
  hubAddress: string,
  hubName: string
) => {
  try {
    return Promise.all(
      tokens.map(async (token: any) => {
        const tokensMetaData = await db.fetchTokensMetadata();
        const tokenData: any = Object.values(tokensMetaData).find(
          (tk: any) => tk.address.toLowerCase() === token.address.toLowerCase()
        );
        const balance = await fetchTokenBalance(
          token.address,
          hubAddress,
          hubName
        );
        return {
          token: token.short_name,
          balance,
          fiatPrice: tokenData && tokenData.fiatPrice ? tokenData.fiatPrice : 0,
        };
      })
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

const timer = (ms) => {
  return new Promise((res) => setTimeout(res, ms));
};

const GAS_PRICE = '5000000000';
const GAS_LIMIT = 350000;
const CHALLENGE_GAS_LIMIT = 400000;

const GAS_FEES = () => new BigNumber(GAS_PRICE).times(GAS_LIMIT);
const CHALLENGE_FEES = () =>
  new BigNumber(GAS_PRICE).times(CHALLENGE_GAS_LIMIT);

export default {
  getTokensBalances,
  GAS_PRICE,
  GAS_LIMIT,
  GAS_FEES,
  timer,
  CHALLENGE_FEES,
};
