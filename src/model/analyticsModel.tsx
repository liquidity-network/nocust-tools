import { action, Action, thunk, Thunk } from 'easy-peasy';
import Moment from 'moment';
import api from '../api';
import { StoreModel } from '.';
import helper from '../utils/helper';

export interface AnalyticsModel {
  openChartPopup: boolean;
  chartType: string;
  latestBlock: number;
  confirmedBlock: number;
  currentRound: number;
  totalTransfers: number;
  totalWithdrawals: number;
  totalDeposits: number;
  totalWallets: number;
  transfersDays: [];
  transfersCount: [];
  hubAvailability: number;
  walletsEons: [];
  walletsCount: [];
  hubBalance: number;
  hubTokens: [];
  tokensBalances: any;

  fetchHubStatus: Thunk<AnalyticsModel, string>;
  fetchTransfers: Thunk<AnalyticsModel, string>;
  fetchHubDeposits: Thunk<AnalyticsModel, string>;
  fetchHubWithdrawals: Thunk<AnalyticsModel, string>;
  fetchHubWallets: Thunk<AnalyticsModel, string>;
  fetchHubTokens: Thunk<AnalyticsModel, string, StoreModel>;

  setLatestBlock: Action<AnalyticsModel, number>;
  setConfirmedBlock: Action<AnalyticsModel, number>;
  setCurrentRounds: Action<AnalyticsModel, number>;

  setTotalTransfers: Action<AnalyticsModel, number>;
  setTransferDays: Action<AnalyticsModel, []>;
  setTransferCounts: Action<AnalyticsModel, []>;

  setHubDeposits: Action<AnalyticsModel, number>;
  setHubWithdrawals: Action<AnalyticsModel, number>;
  setHubWallets: Action<AnalyticsModel, number>;
  setWalletsEons: Action<AnalyticsModel, []>;
  setWalletsCount: Action<AnalyticsModel, []>;
  setHubTokens: Action<AnalyticsModel, []>;
  setHubBalance: Action<AnalyticsModel, number>;
  setTokensBalances: Action<AnalyticsModel, any>;
  setOpenChartPopup: Action<AnalyticsModel, boolean>;
  setChartType: Action<AnalyticsModel, string>;
}

const analyticsModel: AnalyticsModel = {
  openChartPopup: false,
  chartType: '',
  latestBlock: 0,
  confirmedBlock: 0,
  currentRound: 0,
  totalTransfers: 0,
  totalWithdrawals: 0,
  totalDeposits: 0,
  totalWallets: 0,
  transfersDays: [],
  transfersCount: [],
  hubAvailability: 0,
  walletsEons: [],
  walletsCount: [],
  hubBalance: 0,
  hubTokens: [],
  tokensBalances: [],
  fetchHubStatus: thunk(async (actions, payload) => {
    const fetched = await api.fetchHubStatus(payload);
    actions.setLatestBlock(fetched.latest.block);
    actions.setConfirmedBlock(fetched.confirmed.block);
    actions.setCurrentRounds(fetched.latest.eon_number);
  }),
  fetchTransfers: thunk(async (actions, payload) => {
    const fetched = await api.fetchHubTransfers(payload);
    const days = fetched.time.map((obj: any) =>
      Moment(obj.day).format('MMM Do')
    );
    const count = fetched.time.map((obj: any) => obj.count);
    actions.setTotalTransfers(fetched.total);
    actions.setTransferDays(days);
    actions.setTransferCounts(count);
  }),

  fetchHubDeposits: thunk(async (actions, payload) => {
    const fetched = await api.fetchHubDeposits(payload);
    actions.setHubDeposits(fetched.total);
  }),
  fetchHubWithdrawals: thunk(async (actions, payload) => {
    const fetched = await api.fetchHubWithdrawals(payload);
    actions.setHubWithdrawals(fetched.total);
  }),
  fetchHubWallets: thunk(async (actions, payload) => {
    const fetched = await api.fetchHubWallets(payload);
    const wallets_eons = fetched.eon_number.map(
      (obj: any) => obj.registration_eon_number
    );
    const wallets_count = fetched.eon_number.map((obj: any) => obj.count);
    actions.setHubWallets(fetched.total);
    actions.setWalletsEons(wallets_eons);
    actions.setWalletsCount(wallets_count);
  }),
  fetchHubTokens: thunk(async (actions, payload, state) => {
    const fetched = await api.listTokens(payload);
    const ethToken = fetched.find((token: any) => token.short_name === 'ETH');
    const hubAddress = ethToken ? ethToken.address : undefined;
    const storeState: any = state.getStoreState();
    const hubName = storeState.hubModel.selectedHub;
    const hubBalances = await helper.getTokensBalances(
      fetched,
      hubAddress,
      hubName.toLowerCase()
    );
    actions.setHubTokens(fetched);
    actions.setTokensBalances(hubBalances);
    actions.setHubBalance(hubBalances[0].balance);
  }),
  setLatestBlock: action((state, payload) => {
    state.latestBlock = payload;
  }),
  setConfirmedBlock: action((state, payload) => {
    state.confirmedBlock = payload;
  }),
  setCurrentRounds: action((state, payload) => {
    state.currentRound = payload;
  }),
  setTotalTransfers: action((state, payload) => {
    state.totalTransfers = payload;
  }),
  setTransferDays: action((state, payload) => {
    state.transfersDays = payload;
  }),
  setTransferCounts: action((state, payload) => {
    state.transfersCount = payload;
  }),
  setHubDeposits: action((state, payload) => {
    state.totalDeposits = payload;
  }),
  setHubWithdrawals: action((state, payload) => {
    state.totalWithdrawals = payload;
  }),
  setHubWallets: action((state, payload) => {
    state.totalWallets = payload;
  }),
  setWalletsEons: action((state, payload) => {
    state.walletsEons = payload;
  }),
  setWalletsCount: action((state, payload) => {
    state.walletsCount = payload;
  }),
  setHubTokens: action((state, payload) => {
    state.hubTokens = payload;
  }),
  setTokensBalances: action((state, payload) => {
    state.tokensBalances = payload;
  }),
  setHubBalance: action((state, payload) => {
    state.hubBalance = payload;
  }),
  setOpenChartPopup: action((state, payload) => {
    state.openChartPopup = payload;
  }),
  setChartType: action((state, payload) => {
    state.chartType = payload;
  }),
};

export default analyticsModel;
