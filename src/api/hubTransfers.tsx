import Axios from 'axios';

const fetchCurrentEon = (hub_url: string) => {
  return Axios.get(`${hub_url}/audit/`).then(
    (results) => results.data.latest.eon_number
  );
};

const fetchHubTransfersData = async (url: string) => {
  return Axios.get(`${url}`).then((results) => results.data);
};

export default {
  fetchCurrentEon,
  fetchHubTransfersData,
};
