import Axios from 'axios';

const fetchHubStatus = (hubUrl: string) =>
  Axios.get(`${hubUrl}/audit`).then(results => results.data);

const fetchHubDeposits = (hubUrl: string) =>
  Axios.get(`${hubUrl}/analytics/deposits`).then(results => results.data);

const fetchHubWithdrawals = (hubUrl: string) =>
  Axios.get(`${hubUrl}/analytics/withdrawals`).then(results => results.data);

const fetchHubTransfers = (hubUrl: string) =>
  Axios.get(`${hubUrl}/analytics/transactions`).then(results => results.data);

const fetchHubWallets = (hubUrl: string) =>
  Axios.get(`${hubUrl}/analytics/wallets`).then(results => results.data);

export default {
  fetchHubStatus,
  fetchHubDeposits,
  fetchHubWithdrawals,
  fetchHubTransfers,
  fetchHubWallets
};
