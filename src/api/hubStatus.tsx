import Axios from 'axios';

const checkHubDailyStatus = (hub: string) => {
  return Axios.get(
    `${process.env.REACT_APP_WATCHDOG}/status?hub=${hub.toLowerCase()}`
  ).then(results => results.data);
};

export default {
  checkHubDailyStatus
};
