/* eslint-disable no-loop-func */
import { action, Action, thunk, Thunk } from 'easy-peasy';
import { nocust } from 'nocust-client';
import HDKey from 'ethereumjs-wallet/hdkey';
import { mnemonicToSeed } from 'bip39';
import { initialDerivedPath } from '../utils/web3Utils';
import { web3, initNocustManager } from '../utils/nocustInit';
import _ from 'lodash';
import { db } from '../utils/firebase';
import helper from '../utils/helper';
import BigNumber from 'bignumber.js';
import hubs from '../utils/hubs';
import Axios from 'axios';
import { HubNames } from './hubModel';

const walletData = localStorage.getItem('walletInfo');
const hubTokens = localStorage.getItem('supportedTokens');
const notificationPayload = localStorage.getItem('notificationPayload');
const withdrawalData: any = localStorage.getItem('withdrawalData');

export interface NocustModel {
  selectedHub: string;
  isRecoveryMode: boolean;
  isNocustInitialized: boolean;
  loading: boolean;
  walletImported: boolean;
  loadingMsg: string;
  notificationPayload: any[];
  withdrawalData: Array<any>;
  supportedTokens: Array<any>;
  walletInfo: { walletAddress: string; privateKey: string; seedPhrase: string };
  importWallet: Thunk<NocustModel, { seedPhrase: string; hubName: string }>;
  withdrawFund: Thunk<NocustModel>;
  recoverFunds: Thunk<NocustModel>;
  fetchBlockNumber: Thunk<NocustModel>;
  fetchWalletBalance: Thunk<NocustModel>;
  initNocust: Thunk<NocustModel, string>;
  setWalletInfo: Action<
    NocustModel,
    { walletAddress: string; privateKey: string; seedPhrase: string }
  >;
  setLoading: Action<NocustModel, boolean>;
  setIsRecoveryMode: Action<NocustModel, boolean>;
  setLoadingMsg: Action<NocustModel, string>;
  setSupportedTokens: Action<NocustModel, Array<any>>;
  setWalletImported: Action<NocustModel, boolean>;
  setNotificationPayload: Action<
    NocustModel,
    {
      date: Date;
      hubName: string;
      type: string;
      hubStatus: string;
      message: string;
      token: string;
      status: string;
    }
  >;
  setWithdrawalData: Action<NocustModel, Array<any>>;
  setSelectedHub: Action<NocustModel, string>;
  setIsNoucstInitialized: Action<NocustModel, boolean>;
}

const nocustModel: NocustModel = {
  selectedHub: 'RINKEBY' || localStorage.getItem('selectedHub'),
  loading: false,
  isRecoveryMode: false,
  isNocustInitialized: false,
  walletImported: false,
  loadingMsg: '',
  withdrawalData: JSON.parse(withdrawalData) || [],
  notificationPayload: notificationPayload
    ? JSON.parse(notificationPayload)
    : [],
  supportedTokens: hubTokens ? JSON.parse(hubTokens) : [],
  walletInfo: walletData
    ? JSON.parse(walletData)
    : {
        walletAddress: '',
        privateKey: '',
        seedPhrase: '',
      },
  initNocust: thunk(async (actions, payload) => {
    const res = await initNocustManager(HubNames[payload]);
    console.log(res);
    const isInRecoveryMode = await nocust.isRecoveryMode();
    actions.setIsNoucstInitialized(true);
    actions.setIsRecoveryMode(isInRecoveryMode);
    if (isInRecoveryMode) {
      return Promise.reject(
        'Cannot perform this operation, hub is in recovery mode'
      );
    }

    actions.setIsNoucstInitialized(true);
  }),
  importWallet: thunk(async (actions, payload) => {
    actions.setLoadingMsg('Importing wallet, please wait...');
    const secretKey = mnemonicToSeed(payload.seedPhrase);
    const HDWallet = HDKey.fromMasterSeed(secretKey);
    const wallet = HDWallet.derivePath(initialDerivedPath(0)).getWallet();
    const privateKey = wallet.getPrivateKeyString();
    const publicKey = wallet.getAddressString();
    const walletAddress = web3.utils.toChecksumAddress(publicKey);

    const isRegistered = await nocust.isWalletRegistered(walletAddress);
    if (!isRegistered) {
      return Promise.reject('Not registered with operator');
    }
    const tokens = await nocust.getSupportedTokens();

    nocust.addPrivateKey(privateKey);
    await nocust.getWallet(walletAddress);
    actions.setWalletInfo({
      walletAddress,
      privateKey,
      seedPhrase: payload.seedPhrase,
    });
    actions.setSupportedTokens(tokens);
    actions.setWalletImported(true);
    localStorage.setItem(
      'walletInfo',
      JSON.stringify({
        walletAddress,
        privateKey,
        seedPhrase: payload.seedPhrase,
      })
    );
    localStorage.setItem('supportedTokens', JSON.stringify(tokens));
    return {
      tokens,
      walletAddress,
    };
  }),
  fetchWalletBalance: thunk(async (actions, payload, { getState }) => {
    const tokensMetaData = await db.fetchTokensMetadata();
    console.log(tokensMetaData);
    const { supportedTokens, walletInfo } = getState();
    const fetched = supportedTokens;
    console.log(fetched);

    const tokenCheker = await Promise.all(
      fetched.map(async (token: any) => {
        const isRegistered = await nocust.isWalletRegistered(
          walletInfo.walletAddress,
          token.address
        );
        if (isRegistered) {
          return token;
        }
        return false;
      })
    );

    const registeredTokens = tokenCheker.filter((item) => item !== false);

    if (registeredTokens.length > 0) {
      actions.setLoadingMsg('Fetching your balance, please wait...');
      const tokensData = await Promise.all(
        registeredTokens.map(async (token: any) => {
          // const tokenData: any = Object.values(tokensMetaData).find(
          //   (tk: any) =>
          //     tk.address.toLowerCase() === token.address.toLowerCase()
          // );

          const balance = await nocust.getBalance(
            walletInfo.walletAddress,
            token.address
          );
          console.log(balance);

          // const fiatPrice = tokenData.fiatPrice || 0;
          const fiatPrice = 0;
          return {
            ...token,
            balance,
            commitChainBalance: balance.shiftedBy(-18).toFixed(3),
            fiatBalance: Number(balance.shiftedBy(-18)) * fiatPrice,
          };
        })
      );
      actions.setSupportedTokens(tokensData);
    } else {
      throw new Error('Wallet is not registered with operator');
    }
    actions.setLoadingMsg('');
  }),
  withdrawFund: thunk(async (actions, payload, { getState }) => {
    const isRecovery = await nocust.isRecoveryMode();
    if (isRecovery) {
      return Promise.reject('Contract is in recovery mode');
    }
    actions.setLoading(true);
    actions.setLoadingMsg('Preparing withdrawal requests, please hold...');
    const tokensList = [...getState().supportedTokens];
    const ethIndex = tokensList.findIndex((token) => token.shortName === 'ETH');
    tokensList.push(tokensList.splice(ethIndex, 1)[0]);
    const withdrawalFees = nocust.getWithdrawalFee(helper.GAS_PRICE);

    console.log(
      withdrawalFees.isGreaterThanOrEqualTo(
        new BigNumber(helper.GAS_PRICE).times(helper.GAS_LIMIT)
      )
    );

    for (const token of tokensList) {
      let tokenData = { ...token };
      const ethBalance = await nocust.getParentChainBalance(
        getState().walletInfo.walletAddress
      );

      console.log('EthBalance', ethBalance.shiftedBy(-18).toFixed(5));

      const withdrawalLimit: BigNumber = await nocust.getWithdrawalLimit(
        getState().walletInfo.walletAddress,
        token.address
      );

      console.log('withdrawalLimit', withdrawalLimit.shiftedBy(-18).toFixed(5));

      if (
        ethBalance.isGreaterThan(withdrawalFees) &&
        withdrawalLimit.isGreaterThan(new BigNumber(0))
      ) {
        try {
          const withdrawalRequest = await nocust.withdraw({
            address: getState().walletInfo.walletAddress,
            amount: withdrawalLimit,
            gasPrice: helper.GAS_PRICE,
            token: token.address,
          });
          console.log('withdrawalRequest', withdrawalRequest);

          tokenData['status'] = 'In progress';
          tokenData['withdrawalRequest'] = withdrawalRequest;
          tokenData['isPending'] = true;
        } catch (error) {
          tokenData['status'] = 'Failed - Something went wrong';
          tokenData['isPending'] = false;
        }
      } else if (!withdrawalLimit.isGreaterThan(new BigNumber(0))) {
        tokenData['status'] = 'Failed - 0 balance';
        tokenData['isPending'] = false;
      } else {
        tokenData['status'] = 'Failed - Not enough Eth';
        tokenData['isPending'] = false;
      }
      tokenData['withdrawalLimit'] = withdrawalLimit;
      tokenData['withdrawalFees'] = withdrawalFees;
      tokenData['gasPrice'] = helper.GAS_PRICE;
      tokenData['gasLimit'] = helper.GAS_LIMIT;
      actions.setWithdrawalData([
        ...getState().withdrawalData.filter(
          (x) => x.address !== tokenData.address
        ),
        ...[tokenData],
      ]);
      await helper.timer(5000);
    }

    localStorage.setItem(
      'withdrawalData',
      JSON.stringify(getState().withdrawalData)
    );
    localStorage.setItem('walletInfo', JSON.stringify(getState().walletInfo));
    actions.setLoading(false);
  }),
  recoverFunds: thunk(async (actions, payload, { getState }) => {
    const isRecovery = await nocust.isRecoveryMode();
    if (!isRecovery) {
      return Promise.reject(
        'Hub must be in recovery mode to recover your funds, Please use withdraw funds operation instead'
      );
    }
    const { walletInfo, supportedTokens, selectedHub } = getState();
    const tokens = supportedTokens;
    let tokensList = [...tokens];
    const ethIndex = tokensList.findIndex((token) => token.shortName === 'ETH');
    tokensList.push(tokensList.splice(ethIndex, 1)[0]);
    const ethToken: any = tokensList.find(
      (token: any) => token.shortName === 'ETH'
    );
    const ethBalance = await web3.eth.getBalance(walletInfo.walletAddress);
    const ethBalanceInBN = new BigNumber(ethBalance);

    actions.setLoadingMsg(
      'Checking if wallet is registered with operator, please wait...'
    );
    console.log(
      `${hubs[selectedHub]['2.0'].hubApiUrl}audit/${ethToken.address}/${walletInfo.walletAddress}/whois`
    );

    await Axios.get(
      `${hubs[selectedHub]['2.0'].hubApiUrl}audit/${ethToken.address}/${walletInfo.walletAddress}/whois`
    )
      .then(async () => {
        const lastSubmittedEon = await nocust.getLastSubmittedEon();
        const recoveryEon = lastSubmittedEon - 1;
        console.log('recoveryEon', recoveryEon);
        const tokens: Array<any> = [];
        for await (const token of tokensList) {
          let tokenItem: any = { ...token };
          console.log(
            `${hubs[selectedHub]['2.0'].hubApiUrl}audit/${recoveryEon}/${token.address}/${walletInfo.walletAddress}/`
          );
          await Axios.get(
            `${hubs[selectedHub]['2.0'].hubApiUrl}audit/${recoveryEon}/${token.address}/${walletInfo.walletAddress}/`
          )
            .then(async (res) => {
              const proof = res.data.merkle_proof;
              const balance = new BigNumber(proof.right).minus(
                new BigNumber(proof.left)
              );

              const isRecoverd = await nocust.isWalletRecovered({
                address: walletInfo.walletAddress,
                token: token.address,
              });
              console.log('isRecoverd', isRecoverd);

              if (!isRecoverd) {
                if (balance.isGreaterThan(new BigNumber(0))) {
                  const originalBalance = balance.shiftedBy(-18).toFixed(3);
                  if (ethBalanceInBN.isGreaterThan(helper.GAS_FEES())) {
                    try {
                      await nocust.recoverFunds({
                        address: walletInfo.walletAddress,
                        gasPrice: new BigNumber(helper.GAS_PRICE),
                        token: token.address,
                      });
                      console.log('Success !!!');
                      tokenItem[
                        'status'
                      ] = `${originalBalance} ${tokenItem.shortName} recovered successfully`;
                      tokenItem['color'] = 'green';
                    } catch (error) {
                      console.log('recoverFunds Error', error.message);
                      tokenItem['status'] = 'Something went wrong!!';
                      tokenItem['color'] = 'red';
                    }
                  } else {
                    tokenItem['status'] = 'Not enough Ether for gas';
                    tokenItem['color'] = 'red';
                  }
                } else {
                  tokenItem['status'] = '0 balance, not able to recover';
                  tokenItem['color'] = 'red';
                }
              } else {
                tokenItem['status'] = '0 balance, wallet already recovered';
                tokenItem['color'] = 'green';
              }
              tokens.push(tokenItem);
            })
            .catch((e) => {
              console.log(e, 'Not registered with token');
              tokenItem['status'] = '0 balance, not able to recover';
              tokenItem['color'] = 'red';
              tokens.push(tokenItem);
            });
        }
        actions.setSupportedTokens(tokens);
      })
      .catch(() => {
        console.log('Not registered with operator');
        throw new Error('Not registered with operator');
      });
  }),
  fetchBlockNumber: thunk(async (actions, payload, { getState }) => {
    const { withdrawalData } = getState();

    const pendingWithdrawals = withdrawalData.filter(
      (token: any) => token.isPending
    );

    for (const token of pendingWithdrawals) {
      token['blockNumber'] = 'Fetching block number...';
      actions.setWithdrawalData([
        ...withdrawalData.filter((tk: any) => tk !== token),
        ...[token],
      ]);

      try {
        const blockNumber = await nocust.getBlocksToWithdrawalConfirmation(
          token.withdrawalRequest
        );

        console.log('blockNumber', blockNumber);

        if (blockNumber === 0) {
          token['status'] = 'Confirming withdrawal...';
          // const confirmWithdrawal = await nocust.confirmWithdrawal({
          //   address: walletInfo.walletAddress,
          //   gasPrice: token.gasPrice,
          //   token: token.address,
          // });
          token['status'] = 'Withdrawal confirmed';
          token['isConfirmed'] = true;
          token['isPending'] = false;
        }
        if (blockNumber === -1) {
          token['status'] = 'No pending withdrawals';
          token['isConfirmed'] = false;
          token['isPending'] = false;
        }
        token['blockNumber'] = `Blocks to confirm ${blockNumber}`;
        actions.setWithdrawalData([
          ...withdrawalData.filter((tk: any) => tk !== token),
          ...[token],
        ]);
      } catch (error) {
        console.log('error' + error);
      }
    }
  }),
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  setLoadingMsg: action((state, payload) => {
    state.loadingMsg = payload;
  }),
  setSupportedTokens: action((state, payload) => {
    state.supportedTokens = payload;
  }),
  setWalletInfo: action((state, payload) => {
    state.walletInfo = payload;
  }),
  setWalletImported: action((state, payload) => {
    state.walletImported = payload;
  }),
  setNotificationPayload: action((state, payload) => {
    const data = _.uniqBy([...state.notificationPayload, ...[payload]], 'date');
    state.notificationPayload = data;
    localStorage.setItem('notificationPayload', JSON.stringify(data));
  }),
  setWithdrawalData: action((state, payload) => {
    state.withdrawalData = payload;
  }),
  setSelectedHub: action((state, payload) => {
    state.selectedHub = payload;
    localStorage.setItem('selectedHub', payload);
  }),
  setIsNoucstInitialized: action((state, payload) => {
    state.isNocustInitialized = payload;
  }),
  setIsRecoveryMode: action((state, payload) => {
    state.isRecoveryMode = payload;
  }),
};

export default nocustModel;
