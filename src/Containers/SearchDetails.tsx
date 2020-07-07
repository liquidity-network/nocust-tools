import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import WalletResult from '../Components/WalletResult';
import { useStoreActions } from '../store';
import { HubNames } from '../model/hubModel';
import TransferResult from '../Components/TransferResult';

const SearchDetails = (props: any) => {
  const [searchData, setSearchData] = useState({ hub: '', query: '' });
  const {
    hubModel: hubActions,
    transferModel: transferActions
  } = useStoreActions(state => state);

  useEffect(() => {
    hubActions.setHideLogo(false);
    transferActions.setIsSideOpen(false);
    hubActions.setHideDropdown(true);
    const hubNames = Object.keys(HubNames);
    const { hub, query } = props.match.params;
    if (!hub || !query || !hubNames.includes(hub.toUpperCase())) {
      props.history.push('/search');
    }

    setSearchData({ hub, query });

    // eslint-disable-next-line
  }, []);
  return (
    <Container>
      <InnerContainer>
        {searchData.query.startsWith('0x') ? (
          <WalletResult {...props} />
        ) : (
          <TransferResult {...props} />
        )}
      </InnerContainer>
    </Container>
  );
};

export default SearchDetails;

const Container = styled.div`
  background: #fff;
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 12rem;
`;

const InnerContainer = styled.div`
  max-width: 1170px;
  padding: 0 15px;
  margin: 0 auto 0 auto;
`;
