import React from 'react';
import styled from 'styled-components';
import DataTable from 'react-data-table-component';
import { formatTokenWithUnit } from '../utils/conversion';

const DTable = (props: any) => {
  const columns = [
    {
      name: 'Tx ID',
      selector: 'txid'
    },
    {
      name: 'Block',
      selector: 'block'
    },
    {
      name: 'Eon No.',
      selector: 'eon_number'
    },
    {
      name: 'Amount',
      selector: 'amount',
      cell: row => formatTokenWithUnit(row.amount)
    },
    {
      name: 'Time',
      selector: 'time'
    }
  ];
  return (
    <CustomDataTable
      columns={columns}
      data={props.data}
      onRowExpandToggled={() => {}}
      pagination={true}
    />
  );
};

export default DTable;

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
