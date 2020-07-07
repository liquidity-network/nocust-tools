import hubStatus from './hubStatus';
import hubAnalytics from './hubAnalytics';
import hubTokens from './hubTokens';
import hubTransfers from './hubTransfers';
import userAnalytics from './userAnalytics';

export default {
  ...hubStatus,
  ...hubAnalytics,
  ...hubTokens,
  ...hubTransfers,
  ...userAnalytics
};
