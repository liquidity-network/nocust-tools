import Web3 from 'web3';
import BigNumber from 'bignumber.js';

const initWeb3 = (hub: string) => {
  if (hub === 'limbo') {
    return new Web3(
      new Web3.providers.HttpProvider('https://limbo.liquidity.network/ethrpc')
    );
  }
  return new Web3(
    new Web3.providers.HttpProvider(
      `https://${hub}.infura.io/v3/f2caecc060944f75af5b052aa5d8ba88`
    )
  );
};

const minABI: any = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
];

export const fetchWalletTokensBalances = async (
  hub: string,
  walletAddress: string,
  tokenAddress: string,
  hubAddress: string
) => {
  const web3 = initWeb3(hub);
  const contract = new web3.eth.Contract(minABI, tokenAddress);
  const tokenIsEth = hubAddress.toLowerCase() === tokenAddress.toLowerCase();
  const balance = tokenIsEth
    ? await web3.eth.getBalance(walletAddress)
    : await contract.methods.balanceOf(walletAddress).call();

  const balanceBN = new BigNumber(balance);
  return balanceBN.isNaN() ? '0.00' : balanceBN.shiftedBy(-18).toFixed(3);
};

export const fetchTokenBalance = (
  tokenAddress: string,
  hubAddress: string,
  hub: string
) => {
  if (!hubAddress) return Promise.resolve(0);
  const web3 = initWeb3(hub);
  const tokenIsEth = hubAddress.toLowerCase() === tokenAddress.toLowerCase();
  const contract = new web3.eth.Contract(minABI, tokenAddress);

  let promise = tokenIsEth
    ? web3.eth.getBalance(hubAddress)
    : contract.methods.balanceOf(hubAddress).call();

  return promise.then((balance: any) =>
    new BigNumber(balance).shiftedBy(-18).toFixed(3)
  );
};

export const initialDerivedPath = (num: number): string =>
  `m/44'/60'/0'/0/${num}`;
