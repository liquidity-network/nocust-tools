import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useStoreActions, useStoreState } from '../store';
import { formatTokenWithUnit } from '../utils/conversion';
import { HubURLS } from '../model/hubModel';
import Loader from './ui/Loader';

interface Props {
  allowPagination: boolean;
  transactions: Array<any>;
  userWallet: boolean;
  title: string;
}
const Tx = (props: Props) => {
  const observer: any = useRef();
  const [isFetching, setIsFetching] = useState(true);
  const {
    transferModel: transferActions,
    hubModel: hubActions,
  } = useStoreActions((state) => state);
  const { transferModel: transferState, hubModel: hubState } = useStoreState(
    (state) => state
  );

  const openTx = (transfer) => {
    transferActions.setIsSideOpen(true);
    transferActions.setSelectedTransfer(transfer);
  };

  const sliceAddress = (address: string) => {
    return `${address.slice(0, 10 + 2)}...${address.slice(-10)}`;
  };

  useEffect(() => {
    hubActions.setHideLogo(false);
    transferActions.setIsSideOpen(false);
    hubActions.setHideDropdown(false);
    if (props.allowPagination) {
      handleData();
    }
    // eslint-disable-next-line
  }, []);

  const handleData = async () => {
    const hubURL = HubURLS[hubState.selectedHub];
    await transferActions.fetchHubTransfersData({
      url: hubURL,
      ordering: '-eon_number',
    });
    setIsFetching(false);
  };

  const lastTxElementRef = useCallback(
    (node) => {
      if (isFetching || !props.allowPagination) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && transferState.hasMore) {
          setIsFetching(true);
          handleData();
        }
      });
      if (node) observer.current.observe(node);
    },
    // eslint-disable-next-line
    [isFetching, transferState.hasMore]
  );

  const returnStatus = (transfer: any) => {
    if (transfer.complete) {
      return <span className="success">Success</span>;
    } else if (transfer.cancelled) {
      return <span className="failed">Cancelled</span>;
    } else if (!transfer.complete || !transfer.cancelled) {
      return <span className="pending">Pending</span>;
    } else {
      return <span className="failed">Cancelled</span>;
    }
  };

  return (
    <Container id="list">
      <InnerContainer>
        <SideTitle>{props.title}</SideTitle>
        <TableContainer>
          <Table>
            <THead>
              <Tr>
                <th>ID</th>
                <th>Type</th>
                <th>Eon Number</th>
                <th>Hub</th>
                <th>Time</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Status</th>
              </Tr>
            </THead>
            <Tbody>
              {!transferState.hasMore && !props.transactions.length ? (
                <Tr>
                  <Td
                    style={{ textAlign: 'center', padding: '4rem 0' }}
                    colSpan={9}
                  >
                    No transfers found
                  </Td>
                </Tr>
              ) : (
                props.transactions.map((transfer: any, index: number) => {
                  if (props.transactions.length === index + 1) {
                    return (
                      <Tr
                        ref={lastTxElementRef}
                        key={transfer.id}
                        onClick={() => openTx(transfer)}
                      >
                        <Td>{transfer.id}</Td>
                        <Td>
                          <b>{transfer.swap ? 'Swap' : 'Transfer'}</b>
                        </Td>
                        <Td>{transfer.eon_number}</Td>
                        <Td>{hubState.selectedHub}</Td>
                        <Td className="time">
                          {props.userWallet ? (
                            <b>
                              {format(
                                new Date(0).setUTCSeconds(transfer.timestamp),
                                'MM/dd/yyyy, h:mm a'
                              )}
                            </b>
                          ) : (
                            <b>
                              {format(
                                new Date(0).setUTCSeconds(transfer.time),
                                'MM/dd/yyyy, h:mm a'
                              )}
                            </b>
                          )}
                        </Td>
                        <Td>{sliceAddress(transfer.wallet.address)}</Td>
                        <Td>{sliceAddress(transfer.recipient.address)}</Td>
                        <Td>{formatTokenWithUnit(transfer.amount)}</Td>
                        <Td>{returnStatus(transfer)}</Td>
                      </Tr>
                    );
                  } else {
                    return (
                      <Tr key={transfer.id} onClick={() => openTx(transfer)}>
                        <Td>{transfer.id}</Td>
                        <Td>
                          <b>{transfer.swap ? 'Swap' : 'Transfer'}</b>
                        </Td>
                        <Td>{transfer.eon_number}</Td>
                        <Td>{hubState.selectedHub}</Td>
                        <Td className="time">
                          {props.userWallet ? (
                            <b>
                              {format(
                                new Date(0).setUTCSeconds(transfer.timestamp),
                                'MM/dd/yyyy, h:mm a'
                              )}
                            </b>
                          ) : (
                            <b>
                              {format(
                                new Date(0).setUTCSeconds(transfer.time),
                                'MM/dd/yyyy, h:mm a'
                              )}
                            </b>
                          )}
                        </Td>

                        <Td>{sliceAddress(transfer.wallet.address)}</Td>

                        <Td>{sliceAddress(transfer.recipient.address)}</Td>

                        <Td>{formatTokenWithUnit(transfer.amount)}</Td>
                        <Td>{returnStatus(transfer)}</Td>
                      </Tr>
                    );
                  }
                })
              )}
            </Tbody>
          </Table>
          {isFetching && props.allowPagination && <Loader />}
        </TableContainer>
      </InnerContainer>
    </Container>
  );
};

export default Tx;

const Container = styled.div`
  margin-top: 4rem;
  background: #fff;
`;

const InnerContainer = styled.div`
  max-width: 1170px;
  margin: 0 auto;

  @media (max-width: 1170px) {
    padding: 0 15px;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 2rem;
`;

const SideTitle = styled.h2`
  color: ${(props) => props.theme.data.textColor};
  font-size: 18px;
`;

const Table = styled.table`
  border: 0;
  border-collapse: collapse;
  width: 100%;
`;

const THead = styled.thead`
  th {
    text-align: left;
    font-weight: normal;
    font-size: 15px;
    padding: 1rem 7px;
    white-space: nowrap;
    &:first-child {
      padding-left: 1rem;
    }

    &:last-child {
      padding-right: 1rem;
    }
  }
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
    &.pending {
      color: darkorange;
    }
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
