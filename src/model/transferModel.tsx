/* eslint-disable @typescript-eslint/no-use-before-define */
import { action, Action, thunk, Thunk } from 'easy-peasy';
import * as _ from 'lodash';
import api from '../api';

interface Txdetails {
  amount: string;
  amount_swapped: string;
  cancelled: boolean;
  complete: boolean;
  eon_number: number;
  id: number;
  nonce: string;
  passive: boolean;
  recipient: {
    address: string;
    token: string;
  };
  swap: boolean;
  time: any;
  tx_id: string;
  voided: boolean;
  timestamp?: any;
  wallet: {
    address: string;
    token: string;
  };
}

export interface TransferModel {
  isSideOpen: boolean;
  hubTransfersData: Array<any>;
  transfersCount: number;
  selectedTransfer: Txdetails;
  currentEon: number | null;
  eonTransferCount: any;
  nextURL: string | null;
  hasMore: boolean;
  fetchHubTransfersData: Thunk<
    TransferModel,
    { url: string; ordering: string }
  >;
  fetchEonNumber: Thunk<TransferModel, string>;
  setIsSideOpen: Action<TransferModel, boolean>;
  setHubTransfersData: Action<TransferModel, []>;
  setSelectedTransfer: Action<TransferModel, Txdetails>;
  setTransfersCount: Action<TransferModel, number>;
  setCurrentEon: Action<TransferModel, number>;
  appendHubTransfers: Action<TransferModel, []>;
  setNextURL: Action<TransferModel, string | null>;
  setHasMore: Action<TransferModel, boolean>;
  setEonTransferCount: Action<TransferModel, {}>;
  clearEonTransferCount: Action<TransferModel, []>;
}

const transferModel: TransferModel = {
  isSideOpen: false,
  hubTransfersData: [],
  nextURL: null,
  transfersCount: 0,
  eonTransferCount: [],
  currentEon: null,
  hasMore: false,
  selectedTransfer: {
    amount: '0',
    amount_swapped: '0',
    cancelled: false,
    complete: false,
    eon_number: 0,
    id: 0,
    nonce: '0',
    passive: false,
    recipient: {
      address: '-',
      token: '-',
    },
    swap: false,
    time: 0,
    tx_id: '0',
    voided: false,
    wallet: {
      address: '-',
      token: '-',
    },
  },
  setIsSideOpen: action((state, payload) => {
    state.isSideOpen = payload;
  }),
  fetchEonNumber: thunk(async (actions, payload) => {
    const eonNumber = await api.fetchCurrentEon(payload);
    actions.setCurrentEon(eonNumber);
  }),
  fetchHubTransfersData: thunk(async (actions, payload, { getState }) => {
    const url = `${payload.url}/audit/transactions/?ordering=${payload.ordering}`;
    const nextURL = getState().nextURL;
    let fetched: any;
    if (nextURL) {
      if (nextURL.startsWith('http:')) {
        const httpsURL = nextURL.replace(/^http:\/\//i, 'https://');
        fetched = await api.fetchHubTransfersData(httpsURL);
      } else {
        fetched = await api.fetchHubTransfersData(nextURL);
      }
    } else {
      fetched = await api.fetchHubTransfersData(url);
    }

    if (fetched.next) {
      actions.setNextURL(fetched.next);
      actions.setHasMore(true);
    } else {
      actions.setHasMore(false);
    }
    actions.appendHubTransfers(fetched.results);
  }),
  setHubTransfersData: action((state, payload) => {
    state.hubTransfersData = payload;
  }),
  setSelectedTransfer: action((state, payload) => {
    state.selectedTransfer = payload;
  }),
  setTransfersCount: action((state, payload) => {
    state.transfersCount = state.transfersCount + payload;
  }),
  setCurrentEon: action((state, payload) => {
    state.currentEon = payload;
  }),
  appendHubTransfers: action((state, payload) => {
    const { hubTransfersData } = state;
    state.hubTransfersData = _.uniqBy([...hubTransfersData, ...payload], 'id')
      .sort((a, b) => b.eon_number - a.eon_number)
      .sort((a, b) => b.time - a.time);
  }),
  setNextURL: action((state, payload) => {
    state.nextURL = payload;
  }),
  setHasMore: action((state, payload) => {
    state.hasMore = payload;
  }),
  setEonTransferCount: action((state, payload) => {
    const prevTransferCount = state.eonTransferCount;
    state.eonTransferCount = _.uniqBy(
      [...prevTransferCount, payload],
      'eon_number'
    );
  }),
  clearEonTransferCount: action((state) => {
    state.eonTransferCount = [];
  }),
};

export default transferModel;
