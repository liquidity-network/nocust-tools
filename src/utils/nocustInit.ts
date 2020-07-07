import { nocust } from 'nocust-client';
import Web3 from 'web3';
import hubs from './hubs';
import { HubNames } from '../model/hubModel';

declare global {
  interface Window {
    nocust: any;
    web3: Web3;
  }
}

let web3: Web3;

export const initNocustManager = async (hubName = HubNames.RINKEBY) => {
  const hub = hubName;
  const currentHub = hubs[hub]['2.0'];
  const HUB_API_URL = currentHub.hubApiUrl;
  const RPC_URL = currentHub.rpcUrl;
  const HUB_CONTRACT_ADDRESS = currentHub.contractAddress;

  web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

  await nocust.init({
    contractAddress: HUB_CONTRACT_ADDRESS,
    operatorUrl: HUB_API_URL,
    rpcUrl: RPC_URL,
  });

  const privateKey = localStorage.getItem('private_key');
  if (privateKey) {
    nocust.addPrivateKey(privateKey);
  }
  return Promise.resolve('Nocust instance created');
};

export { web3 };
