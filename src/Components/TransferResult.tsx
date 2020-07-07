import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { HubURLS } from '../model/hubModel';
import { useStoreActions, useStoreState } from '../store';
import Loader from '../Components/ui/Loader';
import { format } from 'date-fns';
import { formatTokenWithUnit } from '../utils/conversion';

const TransferResult = (props: any) => {
  const { detailsModel: detailsState } = useStoreState(state => state);
  const { detailsModel: detailsActions } = useStoreActions(state => state);
  const [didMount, setDidMount] = useState(false);
  const [searchData, setSearchData] = useState({ hub: '', query: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDidMount(true);
    const { hub, query } = props.match.params;
    setSearchData({ hub, query });
    try {
      if (query.startsWith('0x')) {
        detailsActions.fetchTransferByAddress({
          url: HubURLS[hub.toUpperCase()],
          id: query
        });
      } else {
        detailsActions.fetchTransferById({
          url: HubURLS[hub.toUpperCase()],
          id: query
        });
      }

      setIsLoading(false);
    } catch (error) {
      console.log('TCL: TransferResult -> error', error);
    }
    return () => {
      setDidMount(false);
      detailsActions.setTransferByID(null);
    };
    // eslint-disable-next-line
  }, []);

  if (!didMount) {
    return null;
  }
  return (
    <>
      <TxContainer>
        <b>ID:</b> {searchData.query}
      </TxContainer>
      {isLoading ? (
        <Loader width={'100px'} />
      ) : detailsState.searchedTransfer ? (
        <DetailsTable>
          <Title>Transfer Details</Title>
          <Table>
            <Tbody>
              <Tr>
                <Td>ID</Td>
                <Td>{detailsState.searchedTransfer.id}</Td>
              </Tr>
              <Tr>
                <Td>Date</Td>
                <Td>
                  {detailsState.searchedTransfer.timestamp &&
                    format(
                      detailsState.searchedTransfer.timestamp,
                      'MM/dd/yyyy, h:mm a'
                    )}
                </Td>
              </Tr>
              <Tr>
                <Td>From</Td>
                <Td>{detailsState.searchedTransfer.wallet.address}</Td>
              </Tr>
              <Tr>
                <Td>To</Td>
                <Td>{detailsState.searchedTransfer.recipient.address}</Td>
              </Tr>
              <Tr>
                <Td>Amount</Td>
                <Td>
                  {formatTokenWithUnit(detailsState.searchedTransfer.amount)}
                </Td>
              </Tr>
              <Tr>
                <Td>Gas Limit</Td>
                <Td>0.00</Td>
              </Tr>
              <Tr>
                <Td>Gas Used</Td>
                <Td>0.00</Td>
              </Tr>
              <Tr>
                <Td>Gas Price</Td>
                <Td>0.00</Td>
              </Tr>
              <Tr>
                <Td>Gas Fees</Td>
                <Td>0.00</Td>
              </Tr>
              <Tr>
                <Td>Nonce</Td>
                <Td>{detailsState.searchedTransfer.nonce}</Td>
              </Tr>
              <Tr>
                <Td>Status</Td>
                <Td>
                  {detailsState.searchedTransfer.appended
                    ? 'Success'
                    : 'Failed'}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </DetailsTable>
      ) : (
        <CenterText>
          No data found for this transaction id: <b>{searchData.query}</b>
        </CenterText>
      )}
    </>
  );
};

export default TransferResult;
const TxContainer = styled.div`
  max-width: 800px;
  border: 1px solid ${props => props.theme.data.blueColor};
  border-radius: 3px;
  padding: 20px;
  margin: 4rem auto;
  position: relative;
  text-align: center;
`;

const DetailsTable = styled.div`
  margin-top: 5rem;
`;

const Title = styled.div`
  font-weight: bold;
`;

const Table = styled.table`
  margin-top: 2rem;
  border: 0;
  border-collapse: collapse;
  width: 100%;
`;

const Tr = styled.tr`
  padding: 10px;
`;
const Td = styled.td`
  padding-top: 1rem;
  padding-bottom: 1rem;
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
`;
const Tbody = styled.tbody`
  tr {
    cursor: pointer;
    &:nth-child(odd) {
      background: ${props => props.theme.data.lightBlueColor};
    }
    &:last-child {
      background: ${props => props.theme.data.greenColor};
      color: #fff;
    }
  }
`;

const CenterText = styled.div`
  text-align: center;
`;
