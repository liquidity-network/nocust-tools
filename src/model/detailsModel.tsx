import { action, Action, thunk, Thunk } from 'easy-peasy';
import * as _ from 'lodash';
import api from '../api';

export interface DetailsModel {
  qrPopupOpened: boolean;
  transfers: any;
  isLoading: boolean;
  walletAddress: string;
  scanQRCodePopup: boolean;
  singleTokenTransfers: Array<any>;
  searchedTransfer: any;
  setQrPopupOpened: Action<DetailsModel, boolean>;
  fetchUserTransfers: Thunk<
    DetailsModel,
    { token: string; address: string; hubUrl: string; eons: string }
  >;
  fetchTransferByAddress: Thunk<DetailsModel, { url: string; id: string }>;
  fetchTransferById: Thunk<DetailsModel, { url: string; id: number }>;
  setUserTransfers: Action<DetailsModel, {}>;
  appendUserTransfers: Action<DetailsModel, {}>;
  setWalletAddress: Action<DetailsModel, string>;
  setScanQRCodePopup: Action<DetailsModel, boolean>;
  setTransferByID: Action<DetailsModel, any>;
  setIsLoading: Action<DetailsModel, boolean>;
}

const detailsModel: DetailsModel = {
  qrPopupOpened: false,
  walletAddress: '',
  scanQRCodePopup: false,
  isLoading: false,
  transfers: {
    withdrawals: [],
    transfers: [],
    deposits: [],
    withdrawal_requests: [],
  },
  singleTokenTransfers: [],
  searchedTransfer: null,
  setQrPopupOpened: action((state, payload) => {
    state.qrPopupOpened = payload;
  }),
  fetchUserTransfers: thunk(async (actions, payload, { getState }) => {
    const eons: any = payload.eons.split(' - ');
    const eonsArr: Array<string> = [];
    for (let i = parseInt(eons[0]); i <= parseInt(eons[1]); i++) {
      eonsArr.push(String(i));
    }

    const newArr = eonsArr.filter((eon: string) => eon >= '0');

    let withdrawals: Array<any> = [];
    let transfers: Array<any> = [];
    let deposits: Array<any> = [];
    let withdrawal_requests: Array<any> = [];
    actions.setIsLoading(true);
    await Promise.all(
      newArr.map(async (eon: string) => {
        const fetched = await api.auditUser(
          payload.token,
          payload.address,
          payload.hubUrl,
          eon
        );
        withdrawals = [...withdrawals, ...fetched.withdrawals];
        transfers = [...transfers, ...fetched.transactions];
        deposits = [...deposits, ...fetched.deposits];
        withdrawal_requests = [
          ...withdrawal_requests,
          ...fetched.withdrawal_requests,
        ];
      })
    );
    const AllTransfers = {
      withdrawals,
      transfers: transfers.sort((a, b) => a.eon_number - b.eon_number),
      deposits,
      withdrawal_requests,
    };
    actions.setUserTransfers(AllTransfers);
    actions.setIsLoading(false);
  }),
  fetchTransferByAddress: thunk(async (actions, payload) => {
    const fetched = await api.fetchTransferByAddress(payload.url, payload.id);
    actions.setTransferByID(fetched);
  }),
  fetchTransferById: thunk(async (actions, payload) => {
    const fetched = await api.fetchTransferById(payload.url, payload.id);
    actions.setTransferByID(fetched);
  }),
  setUserTransfers: action((state, payload) => {
    state.transfers = payload;
  }),
  appendUserTransfers: action((state, payload) => {
    const prevTransfers = state.transfers;
    state.transfers = _.uniqBy([...prevTransfers, payload], 'tx_id');
  }),
  setWalletAddress: action((state, payload) => {
    state.walletAddress = payload;
  }),
  setScanQRCodePopup: action((state, payload) => {
    state.scanQRCodePopup = payload;
  }),
  setTransferByID: action((state, payload) => {
    state.searchedTransfer = payload;
  }),
  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
};

export default detailsModel;
