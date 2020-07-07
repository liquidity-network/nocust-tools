import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from '../store';

const WithdrawFunds = (props: any) => {
  const [didMount, setDidMount] = useState(false);
  const [steps, setSteps] = useState(0);
  const [error, setError] = useState<string>('');
  const { nocustModel: nocustState } = useStoreState((state) => state);
  const { nocustModel: nocustActions } = useStoreActions((state) => state);

  const returnTotalFiatPrice = (tokens: Array<any>) => {
    let total = 0;
    if (tokens.length > 0) {
      tokens.forEach((tk: any) => {
        total = total + tk.fiatBalance;
      });
      return total.toFixed(3);
    }
  };

  const fetchNocustOps = async () => {
    try {
      const { walletInfo, selectedHub } = nocustState;
      await nocustActions.importWallet({
        seedPhrase: walletInfo.seedPhrase,
        hubName: selectedHub,
      });
      await nocustActions.fetchWalletBalance();

      if (
        nocustState.withdrawalData.filter(
          (token: any) => token.withdrawalRequest
        ).length > 0
      ) {
        await nocustActions.fetchBlockNumber();
        setSteps(1);
      }

      return Promise.resolve('Wallet Data fetched');
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const withdrawNocustFunds = async () => {
    try {
      await nocustActions.withdrawFund();
      if (
        nocustState.withdrawalData.filter(
          (token: any) => token.withdrawalRequest
        ).length > 0
      ) {
        await nocustActions.fetchBlockNumber();
        setSteps(1);
      }
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    setDidMount(true);
    if (nocustState.isNocustInitialized) {
      fetchNocustOps();
    }
    return () => setDidMount(false);

    // eslint-disable-next-line
  }, [nocustState.isNocustInitialized]);

  if (!didMount) {
    return null;
  }
  return (
    <Container>
      <ContainerInner>
        <Content>
          <Title>Liquidity Network Watch Tower</Title>
          <Intro>
            This tool is built to help users withdraw their funds from NOCUST
            servers
          </Intro>
        </Content>

        {steps === 0 && (
          <StepContainer>
            {nocustState.loading ? (
              <LoadingMsg>{nocustState.loadingMsg}</LoadingMsg>
            ) : (
              <TokenHolder>
                <Heading>
                  <LeftHeading>
                    <b>Token Balances</b> - {nocustState.supportedTokens.length}{' '}
                    Tokens
                  </LeftHeading>
                  <RightData>
                    <DataText>
                      Total: ${' '}
                      {returnTotalFiatPrice(nocustState.supportedTokens)}
                    </DataText>
                  </RightData>
                </Heading>

                <TableContainer>
                  <Table className="token-table">
                    <Tbody>
                      {nocustState.supportedTokens.length > 0 &&
                        nocustState.supportedTokens.map(
                          (token: any, index: number) => {
                            return (
                              <Tr key={index}>
                                <Td>
                                  {token.name} (f{token.shortName})
                                </Td>
                                <Td>
                                  {token.commitChainBalance &&
                                    token.commitChainBalance}{' '}
                                  f{token.shortName} - $
                                  {token.fiatBalance &&
                                    token.fiatBalance.toFixed(3)}
                                </Td>
                              </Tr>
                            );
                          }
                        )}
                    </Tbody>
                  </Table>
                </TableContainer>
                <ErrorMsg>
                  {' '}
                  {error && <span style={{ color: 'red' }}>{error}</span>}
                </ErrorMsg>
              </TokenHolder>
            )}
            <BtnContainer>
              <Btn
                disabled={nocustState.loading}
                onClick={() => withdrawNocustFunds()}
              >
                {nocustState.loading ? 'Please wait...' : 'Withdraw Fund'}
              </Btn>
            </BtnContainer>
          </StepContainer>
        )}

        {steps === 1 && (
          <StepContainer>
            {nocustState.withdrawalData.length > 0 &&
              nocustState.withdrawalData.filter((token: any) => token.isPending)
                .length > 0 && (
                <LoadingMsg>
                  Fund recovery is still <b>in progress</b> this process takes
                  up to 3 days
                </LoadingMsg>
              )}
            <TableContainer style={{ marginTop: '3rem' }}>
              <Table className="token-table">
                <Tbody>
                  {nocustState.withdrawalData.length > 0 &&
                    nocustState.withdrawalData.map((token: any) => {
                      return (
                        <Tr key={token.address}>
                          <Td>
                            {token.name} (f{token.shortName})
                          </Td>
                          <Td style={{ textAlign: 'left' }}>
                            <b>Status: </b>{' '}
                            <span
                              className={
                                token.isConfirmed
                                  ? 'isConfirmed'
                                  : token.isPending
                                  ? 'pendingStatus'
                                  : 'failedStatus'
                              }
                            >
                              {token.status}
                            </span>
                          </Td>
                          <Td style={{ textAlign: 'right' }}>
                            {token.blockNumber}
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
          </StepContainer>
        )}
      </ContainerInner>
    </Container>
  );
};

export default WithdrawFunds;

const Container = styled.div`
  background: #fff;
  width: 100%;
  min-height: 100vh;
`;

const ContainerInner = styled.div`
  max-width: 632px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Content = styled.div``;
const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: #272727;
`;

const Intro = styled.div`
  font-size: 13px;
  margin-top: 2rem;
  text-align: center;
`;

const BtnContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const ErrorMsg = styled.div`
  text-align: center;
  font-size: 12px;
`;

const LoadingMsg = styled.div`
  padding: 2rem 1rem;
  margin: 2rem 0;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #3682dd;
  background: #f3f7fe;
  border-radius: 5px;
`;

const StepContainer = styled.div`
  width: 100%;
`;

const Btn = styled.button`
  border: 0;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => props.theme.data.lightBlueColor};
  border: 1px solid ${(props) => props.theme.data.blueColor};
  color: ${(props) => props.theme.data.blueColor};
  border-radius: 25px;
  padding: 0.5rem 0;
  font-size: 16px;
  width: 10rem;
  @media (max-width: 500px) {
    width: 9rem;
    padding: 0.6rem 0;
  }
  &:hover {
    background: ${(props) => props.theme.data.blueColor};
    color: #fff;
    border: 1px solid transparent;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const Tr = styled.tr`
  padding: 5px;
`;
const Td = styled.td`
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
  padding-left: 7px;
  padding-right: 7px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  &:first-child {
    padding-left: 1rem;
  }
  &:last-child {
    padding-right: 1rem;
  }
  &.time {
    color: #666;
  }
  span {
    &.success {
      color: green;
    }
    &.failed {
      color: red;
    }
  }
  @media (max-width: 991px) {
    font-size: 13px;
  }
  .pendingStatus {
    color: ${(props) => props.theme.data.blueColor};
    font-weight: bold;
  }
  .failedStatus {
    color: red;
    font-weight: bold;
  }
  .isConfirmed {
    color: green;
    font-weight: bold;
  }
`;
const Tbody = styled.tbody`
  tr {
    cursor: pointer;
    &:nth-child(odd) {
      background: ${(props) => props.theme.data.lightBlueColor};
    }
  }
`;

const Table = styled.table`
  border: 0;
  border-collapse: collapse;
  width: 100%;
  &.token-table {
    td:nth-child(2) {
      text-align: right;
    }
  }
`;

const TokenHolder = styled.div`
  margin: 6rem 0;
`;

const Heading = styled.div`
  display: flex;
  align-items: flex-end;
`;

const LeftHeading = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding-top: 8px;
  @media (max-width: 991px) {
    font-size: 14px;
  }
`;

const RightData = styled.div`
  margin-left: auto;
  display: inline-block;
  vertical-align: middle;
`;

const DataText = styled.div`
  display: inline-block;
  vertical-align: middle;
  font-size: 13px;
  @media (max-width: 600px) {
    position: relative;
    top: 5px;
  }
`;
