import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dropdown from '../Components/ui/Dropdown';
import Analytics from '../Components/Analytics';
import HubStatus from '../Components/HubStatus';
import Tx from '../Components/Tx';
import { Link } from 'react-router-dom';
import { HubNames, HubURLS } from '../model/hubModel';
import { useStoreActions, useStoreState } from '../store';
import useInterval from '../utils/intervalHook';

const Dashboard = () => {
  const { hubModel: hubState, transferModel: transferState } = useStoreState(
    (state) => state
  );
  const {
    hubModel: hubActions,
    transferModel: transferActions,
  } = useStoreActions((state) => state);

  const [items] = useState(Object.keys(HubNames));

  const getSelectedItem = async (item: string) => {
    hubActions.setSelectedHub(item);
    fetchAndSetDashboard(item);
  };

  const fetchAndSetDashboard = async (hub: string) => {
    const hubURL = HubURLS[hub];
    hubActions.fetchDashboard(hubURL);
  };

  useEffect(() => {
    transferActions.setIsSideOpen(false);
    hubActions.setHideDropdown(false);
    hubActions.setHideLogo(false);
    fetchAndSetDashboard(hubState.selectedHub);
    // eslint-disable-next-line
  }, []);

  useInterval(() => {
    fetchAndSetDashboard(hubState.selectedHub);
  }, 300000);

  return (
    <Container>
      <StatsBlock>
        <DropDownContainer>
          <Dropdown
            items={items}
            itemSelected={hubState.selectedHub}
            padding={'12px 20px'}
            fontSize={'17px'}
            width={'300px'}
            minWidth={'300px'}
            extraWord={'Selected hub:'}
            getSelectedItem={getSelectedItem}
          />
        </DropDownContainer>
        <StatusContainer>
          <SideTitle>Hub Status</SideTitle>
          <HubStatus />
          <AnalyticsHolder>
            <SideTitle>Analytics Overview</SideTitle>
            <Analytics />
          </AnalyticsHolder>
        </StatusContainer>
      </StatsBlock>
      <Tx
        allowPagination={false}
        title={'Latest Transactions'}
        transactions={transferState.hubTransfersData}
        userWallet={false}
      />

      {transferState.hubTransfersData.length > 0 && (
        <BtnContainer>
          <ViewMoreBtn>
            <Link to="/transactions">View More</Link>
          </ViewMoreBtn>
        </BtnContainer>
      )}
    </Container>
  );
};

export default Dashboard;

const Container = styled.div`
  padding-top: 80px;
  padding-bottom: 10rem;
`;

const StatsBlock = styled.div`
  background: ${(props) => props.theme.data.lightBlueColor};
  padding-bottom: 4rem;
`;

const DropDownContainer = styled.div`
  padding: 4rem 1rem;
  text-align: center;
  button {
    font-weight: bold;
    span {
      font-weight: normal;
    }
  }
`;

const StatusContainer = styled.div`
  max-width: 1170px;
  margin: 0 auto;
  @media (max-width: 1170px) {
    padding: 0 15px;
  }
`;

const SideTitle = styled.h2`
  color: ${(props) => props.theme.data.textColor};
  font-size: 18px;
`;

const AnalyticsHolder = styled.div`
  margin-top: 7rem;
`;

const BtnContainer = styled.div`
  padding: 4rem 0;
  text-align: center;
`;

const ViewMoreBtn = styled.div`
  border: 0;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  display: inline-block;
  transition: all 0.3s ease;
  a {
    display: block;
    background: ${(props) => props.theme.data.lightBlueColor};
    border: 1px solid ${(props) => props.theme.data.blueColor};
    color: ${(props) => props.theme.data.blueColor};
    border-radius: 25px;
    padding: 0.7rem 0;
    font-size: 17px;
    width: 12rem;
    @media (max-width: 500px) {
      width: 9rem;
      padding: 0.6rem 0;
    }
  }
  &:hover {
    a {
      background: ${(props) => props.theme.data.blueColor};
      color: #fff;
      border: 1px solid transparent;
    }
  }
`;
