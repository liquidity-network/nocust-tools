import { action, Action, thunk, Thunk } from 'easy-peasy';

import api from '../api';

export enum HubNames {
  MAINNET = 'MAINNET',
  RINKEBY = 'RINKEBY',
}

export const HubURLS: any = {
  MAINNET: 'https://mainnet-v2.liquidity.network',
  RINKEBY: 'https://rinkeby-v2.liquidity.network',
};

export interface HubModel {
  selectedHub: string;
  statusColor: any;
  statusList: [];

  isLoading: boolean;
  availability: number;
  listLength: number;
  hideDropdown: boolean;
  hideLogo: boolean;
  setSelectedHub: Action<HubModel, string>;
  fetchStatusList: Thunk<HubModel, string>;
  fetchDashboard: Thunk<HubModel, string>;
  setStatusList: Action<HubModel, []>;
  setIsLoading: Action<HubModel, boolean>;
  setAvailability: Action<HubModel, number>;
  setListLength: Action<HubModel, number>;
  setHideDropdown: Action<HubModel, boolean>;
  setHideLogo: Action<HubModel, boolean>;
}

const hubModel: HubModel = {
  selectedHub: HubNames['RINKEBY'],
  statusColor: {
    unavailable: 'orange',
    offline: 'grey',
    online: 'rgb(30, 219, 137)',
  },
  hideLogo: false,
  statusList: [],

  hideDropdown: false,
  isLoading: true,
  availability: 0,
  listLength: 96,
  setSelectedHub: action((state, payload) => {
    state.selectedHub = payload;
  }),
  fetchStatusList: thunk(async (actions, payload) => {
    const fetched = await api.checkHubDailyStatus(payload);
    actions.setStatusList(fetched.data);
    actions.setAvailability(fetched.availability);
    actions.setIsLoading(false);
  }),
  fetchDashboard: thunk(async (actions, payload, { getStoreActions }) => {
    const stateActions: any = getStoreActions();
    const analyticsActions = stateActions.analyticsModel;
    const transferActions = stateActions.transferModel;
    const hubActions = stateActions.hubModel;
    const transfersActions = stateActions.transferModel;
    const hub = Object.keys(HubURLS).find((key) => HubURLS[key] === payload);
    hubActions.fetchStatusList(hub);
    const current_eon = await api.fetchCurrentEon(payload);
    await transferActions.setCurrentEon(current_eon);
    await transferActions.setHubTransfersData([]);
    await transferActions.clearEonTransferCount();
    await transferActions.setNextURL(null);
    analyticsActions.fetchHubStatus(payload);
    analyticsActions.fetchHubTokens(payload);
    analyticsActions.fetchTransfers(payload);
    analyticsActions.fetchHubDeposits(payload);
    analyticsActions.fetchHubWithdrawals(payload);
    analyticsActions.fetchHubWallets(payload);
    transfersActions.fetchHubTransfersData({
      url: payload,
      eonNumber: current_eon,
    });
  }),
  setStatusList: action((state, payload) => {
    state.statusList = payload;
  }),
  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  setAvailability: action((state, payload) => {
    state.availability = payload;
  }),
  setListLength: action((state, payload) => {
    state.listLength = payload;
  }),
  setHideDropdown: action((state, payload) => {
    state.hideDropdown = payload;
  }),
  setHideLogo: action((state, payload) => {
    state.hideLogo = payload;
  }),
};

export default hubModel;
