import React, { useEffect } from 'react';
import styled from 'styled-components';
import Tx from '../Components/Tx';
import { useStoreActions, useStoreState } from '../store';

const Transactions = () => {
  const { transferModel: transferState } = useStoreState(state => state);
  const {
    hubModel: hubActions,
    transferModel: transferActions
  } = useStoreActions(state => state);

  useEffect(() => {
    transferActions.setIsSideOpen(false);
    hubActions.setHideDropdown(false);
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <Tx
        allowPagination={true}
        title={'Recent transactions'}
        transactions={transferState.hubTransfersData}
        userWallet={false}
      />
    </Container>
  );
};

export default Transactions;

const Container = styled.div`
  padding-top: 80px;
  background: #fff;
  min-height: 100vh;
  padding-bottom: 200px;
`;
