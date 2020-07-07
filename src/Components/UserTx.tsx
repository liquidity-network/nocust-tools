import React from 'react';
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { format } from 'date-fns';
import { useStoreState, useStoreActions } from '../store';
import { formatTokenWithUnit } from '../utils/conversion';

const UserTx = (props: any) => {
  const { transferModel: transferActions } = useStoreActions(state => state);
  const { hubModel: hubState } = useStoreState(state => state);

  const sliceAddress = (address: string) => {
    return `${address.slice(0, 8 + 2)}...${address.slice(-8)}`;
  };

  const openTx = transfer => {
    transferActions.setIsSideOpen(true);
    transferActions.setSelectedTransfer(transfer);
  };
  const columns = [
    {
      name: 'ID',
      selector: 'id',
      width: '100px'
    },
    {
      name: 'Type',
      selector: 'type',
      format: row => (row.swap ? <b>Swap</b> : <b>Transfer</b>),
      width: '80px'
    },
    {
      name: 'Eon No.',
      selector: 'eon_number',
      width: '80px'
    },
    {
      name: 'Hub',
      selector: 'hub',
      cell: () => hubState.selectedHub,
      width: '80px'
    },
    {
      name: 'Time',
      selector: 'time',
      format: row =>
        format(new Date(0).setUTCSeconds(row.time), 'MM/dd/yyyy, h:mm a')
    },
    {
      name: 'From',
      selector: 'wallet.address',
      cell: row => sliceAddress(row.wallet.address),
      width: '200px'
    },
    {
      name: 'To',
      selector: 'recipient.address',
      cell: row => sliceAddress(row.recipient.address),
      width: '200px'
    },
    {
      name: 'Amount',
      selector: 'amount',
      cell: row => {
        const formattedAmount = formatTokenWithUnit(row.amount);

        return props.walletAddress.toLowerCase() ===
          row.recipient.address.toLowerCase() ? (
          <Success>+ {formattedAmount}</Success>
        ) : (
          <Failed>- {formattedAmount}</Failed>
        );
      }
    },
    {
      name: 'Status',
      selector: 'status',
      cell: row =>
        row.appended ? <Success>Success</Success> : <Failed>Failed</Failed>
    }
  ];
  return (
    <CustomDataTable
      columns={columns}
      data={props.data}
      onRowExpandToggled={() => {}}
      pagination={true}
      onRowClicked={openTx}
    />
  );
};

export default UserTx;

const Success = styled.span`
  color: green;
`;

const Failed = styled.span`
  color: red;
`;

const CustomDataTable = styled(DataTable)`
  .rdt_TableHeader {
    min-height: 30px;
  }
  .rdt_TableRow {
    border: none;
    cursor: pointer;
    &:nth-child(odd) {
      background: ${props => props.theme.data.lightBlueColor};
    }
  }
`;
