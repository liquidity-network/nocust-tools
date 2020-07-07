import axios from 'axios';
import { remove0x } from '../utils/conversion';

const auditUser = (token, address, hubUrl, eon) => {
  return axios
    .get(`${hubUrl}/audit/${eon}/${token}/${address}`)
    .then((results) => results.data);
};

const fetchTransferByAddress = (url: string, address: string) => {
  return axios
    .get(`${url}/audit/transactions/?search=${remove0x(address)}`)
    .then((results) => results.data);
};

const fetchTransferById = (url: string, id: number) => {
  return axios
    .get(`${url}/audit/transactions/${id}`)
    .then((results) => results.data);
};

export default { auditUser, fetchTransferByAddress, fetchTransferById };
