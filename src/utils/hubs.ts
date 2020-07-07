const hubs: any = {
  RINKEBY: {
    '2.0': {
      hubApiUrl: 'https://rinkeby-v2.liquidity.network/',
      networkId: 4,
      rpcUrl: process.env.REACT_APP_RPC_URL_RINKEBY,
      contractAddress: process.env.REACT_APP_HUB_CONTRACT_ADDRESS_RINKEBY,
    },
    // '2.0': {
    //   hubApiUrl: 'http://localhost:8123/',
    //   networkId: 4,
    //   rpcUrl: 'http://localhost:8545/',
    //   contractAddress: '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
    // },
  },
  MAINNET: {
    '2.0': {
      hubApiUrl: 'https://mainnet-v2.liquidity.network/',
      networkId: 1,
      rpcUrl: process.env.REACT_APP_RPC_URL_MAINNET,
      contractAddress: process.env.REACT_APP_HUB_CONTRACT_ADDRESS_MAINNET,
    },
  },
};

export default hubs;
