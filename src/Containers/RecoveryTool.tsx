/* eslint-disable no-restricted-globals */
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from '../store';

const RecoveryTool = (props: any) => {
  const { nocustModel: nocustState } = useStoreState((state) => state);
  const { nocustModel: nocustActions } = useStoreActions((state) => state);

  useEffect(() => {
    if (nocustState.isNocustInitialized) {
      nocustActions.recoverFunds();
    }
    // eslint-disable-next-line
  }, [nocustState.isNocustInitialized]);
  return (
    <Container>
      <ContainerInner>
        <StepContainer>
          <Title>Welcome to hub recovery tool</Title>
          <Description>
            This tool is built to help users recover their funds from NOCUST
            servers in case of hub is down or in recovery mode
          </Description>
          <TokenHolder>
            <Heading>
              <LeftHeading>
                <b>Token</b> - {nocustState.supportedTokens.length} Tokens
              </LeftHeading>
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
                              <span style={{ color: token.color }}>
                                <b>{token.status}</b>
                              </span>
                            </Td>
                          </Tr>
                        );
                      }
                    )}
                </Tbody>
              </Table>
            </TableContainer>
          </TokenHolder>
          <BtnContainer>
            <Btn onClick={() => props.history.push('/watchtower')}>
              <i className="fa fa-arrow-left"></i> Back
            </Btn>
          </BtnContainer>
        </StepContainer>
      </ContainerInner>
    </Container>
  );
};

export default RecoveryTool;

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
`;

const StepContainer = styled.div`
  width: 100%;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: #272727;
`;

const Description = styled.div`
  font-size: 14px;
  text-align: center;
  margin: 1rem 0 0;
`;

const BtnContainer = styled.div`
  padding: 1rem 0;
  text-align: center;
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
  margin: 0 1rem;
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
