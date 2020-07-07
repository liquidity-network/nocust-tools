import React from 'react';
import styled from 'styled-components';
import BlockAdded from '../assets/images/block-added.svg';
import BlocksConfirmed from '../assets/images/block-confirmed.svg';
import TotalRounds from '../assets/images/total-rounds.svg';
import TotalTransfers from '../assets/images/total-transfers.svg';
import TotalDeposits from '../assets/images/total-deposits.svg';
import TotalWithdrawals from '../assets/images/total-withdrawals.svg';
import TotalWallets from '../assets/images/total-wallets.svg';
import HubBalance from '../assets/images/hub-balance.svg';
import ChartIcon from '../assets/images/chart-icon.svg';
import { useStoreState, useStoreActions } from '../store';
import Dropdown from './ui/Dropdown';

const Analytics = () => {
  const { analyticsModel: analyticsState } = useStoreState(state => state);
  const { analyticsModel: analyticsActions } = useStoreActions(state => state);
  const getSelectedItem = (item: string) => {
    const { tokensBalances } = analyticsState;
    const currentBalance = tokensBalances.find(
      (single: any) => single.token === item
    );
    analyticsActions.setHubBalance(currentBalance.balance);
  };
  return (
    <AnalyticsContainer>
      <AnalyticsBlock>
        <img src={BlockAdded} alt="" />
        <BlockText>Latest Block Added</BlockText>
        <Space />
        <StatisticNumber>{analyticsState.latestBlock}</StatisticNumber>
      </AnalyticsBlock>

      <AnalyticsBlock>
        <img src={BlocksConfirmed} alt="" />
        <BlockText>Latest Block Confirmed</BlockText>
        <Space />
        <StatisticNumber>{analyticsState.confirmedBlock}</StatisticNumber>
      </AnalyticsBlock>

      <AnalyticsBlock>
        <img src={TotalRounds} alt="" />
        <BlockText>Current Eon</BlockText>
        <Space />
        <StatisticNumber>{analyticsState.currentRound}</StatisticNumber>
      </AnalyticsBlock>

      <AnalyticsBlock>
        <ChartBtn
          onClick={() => {
            analyticsActions.setOpenChartPopup(true);
            analyticsActions.setChartType('transfers');
          }}
        >
          <img src={ChartIcon} alt="" />
        </ChartBtn>
        <img src={TotalTransfers} alt="" />
        <BlockText>Total Transfers</BlockText>
        <Space />
        <StatisticNumber>{analyticsState.totalTransfers}</StatisticNumber>
      </AnalyticsBlock>

      <AnalyticsBlock>
        <img src={TotalDeposits} alt="" />
        <BlockText>Total Deposits</BlockText>
        <Space />
        <StatisticNumber>{analyticsState.totalDeposits}</StatisticNumber>
      </AnalyticsBlock>

      <AnalyticsBlock>
        <img src={TotalWithdrawals} alt="" />
        <BlockText>Total Withdrawals</BlockText>
        <Space />
        <StatisticNumber>{analyticsState.totalWithdrawals}</StatisticNumber>
      </AnalyticsBlock>

      <AnalyticsBlock>
        <ChartBtn
          onClick={() => {
            analyticsActions.setOpenChartPopup(true);
            analyticsActions.setChartType('wallets');
          }}
        >
          <img src={ChartIcon} alt="" />
        </ChartBtn>
        <img src={TotalWallets} alt="" />
        <BlockText>Total Wallets</BlockText>
        <Space />
        <StatisticNumber>{analyticsState.totalWallets}</StatisticNumber>
      </AnalyticsBlock>

      <AnalyticsBlock>
        <img src={HubBalance} alt="" />
        <BlockText>Hub Balance</BlockText>
        <Space>
          {analyticsState.tokensBalances.length > 0 ? (
            <Dropdown
              items={analyticsState.tokensBalances.map(
                (single: any) => single.token
              )}
              itemSelected={analyticsState.tokensBalances[0].token}
              padding={'5px 15px'}
              fontSize={'13px'}
              width={'80px'}
              minWidth={'100px'}
              getSelectedItem={getSelectedItem}
            />
          ) : (
            ''
          )}
        </Space>

        <StatisticNumber>{analyticsState.hubBalance}</StatisticNumber>
      </AnalyticsBlock>
    </AnalyticsContainer>
  );
};

export default Analytics;

const AnalyticsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 2rem;
  @media (max-width: 991px) {
    flex-direction: column;
    align-items: center;
  }
`;

const AnalyticsBlock = styled.div`
  background: #fff;
  border-radius: 5px;
  text-align: center;
  flex: 0 0 22%;
  padding: 2.2rem 1rem;
  margin-bottom: 3rem;
  position: relative;
  img {
    width: 4rem;
    margin-bottom: 1rem;
  }

  @media (max-width: 1170px) {
    max-width: 300px;
    width: 300px;
  }
`;

const BlockText = styled.p`
  margin-top: 0;
`;

const StatisticNumber = styled.h2`
  font-weight: 700;
  font-size: 23px;
  margin-bottom: 0;
  margin-top: 0;
  color: ${props => props.theme.data.textColor};
`;

const ChartBtn = styled.button`
  box-shadow: none;
  outline: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  width: 40px;
  height: 40px;
  top: 15px;
  left: 15px;
  position: absolute;
  img {
    width: 100%;
  }
`;

const Space = styled.div`
  height: 3rem;
  > div {
    display: inline;
  }
`;
