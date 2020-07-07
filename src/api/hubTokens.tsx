import Axios from 'axios';

const listTokens = (hubUrl: string) => {
  return Axios.get(`${hubUrl}/audit/tokens`).then(results => results.data);
};

export default { listTokens };
