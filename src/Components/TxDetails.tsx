import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import TransferIcon from '../assets/images/user-deposit-icon.svg';
import SwapIcon from '../assets/images/swap-icon.svg';
import { useStoreActions, useStoreState } from '../store';
import { formatTokenWithUnit } from '../utils/conversion';

const TxDetails = () => {
  const { transferModel: transferAction } = useStoreActions(state => state);
  const { transferModel: transferState } = useStoreState(state => state);
  const { selectedTransfer: transfer } = transferState;

  const closeTx = () => {
    transferAction.setIsSideOpen(false);
  };

  const returnState = transfer => {
    if (transfer.complete) {
      return <SuccessStatus>Success</SuccessStatus>;
    } else if (transfer.cancelled) {
      return <FailedStatus>Cancelled</FailedStatus>;
    } else {
      return <FailedStatus>Failed</FailedStatus>;
    }
  };

  const returnIcon = transfer => {
    if (transfer.swap) {
      return <img src={SwapIcon} alt="" />;
    } else {
      return <img src={TransferIcon} alt="" />;
    }
  };

  return (
    <Container className={transferState.isSideOpen ? 'mobileOpen' : ''}>
      <CloseBtn onClick={() => closeTx()}>&times;</CloseBtn>
      <TxTopText>
        <p>{transfer.swap ? 'Swap' : 'Transfer'}</p>{' '}
        <p>
          {typeof transfer.time === 'string'
            ? format(
                new Date(0).setUTCSeconds(transfer.timestamp),
                'MM/dd/yyyy, h:mm a'
              )
            : format(
                new Date(0).setUTCSeconds(transfer.time),
                'MM/dd/yyyy, h:mm a'
              )}
        </p>
      </TxTopText>
      <TxCard>
        {returnIcon(transfer)}
        <Amount>{formatTokenWithUnit(transfer.amount)}</Amount>
        <FromAddress>{transfer.wallet.address}</FromAddress>
        {returnState(transfer)}
        <TxData>
          <TxBlock>
            <b>ID:</b> {transfer.id}
          </TxBlock>
          <TxBlock>
            <b>tx_id:</b> {transfer.tx_id}
          </TxBlock>

          <TxBlock>
            <b>From:</b> {transfer.wallet.address}
          </TxBlock>

          <TxBlock>
            <b>To:</b> {transfer.recipient.address}
          </TxBlock>
        </TxData>
      </TxCard>

      <OtherIfno>
        <SideTitle>More details</SideTitle>
        <TxData>
          <TxBlock>
            <b>Transaction Fee:</b> 0.00
          </TxBlock>
          <TxBlock>
            <b>Gas Limit:</b> 0.00
          </TxBlock>

          <TxBlock>
            <b>Gas Used by Transaction:</b> 0.00
          </TxBlock>

          <TxBlock>
            <b>Gas Price:</b> 0.00
          </TxBlock>
          <TxBlock>
            <b>Nonce:</b> {transfer.nonce}
          </TxBlock>
        </TxData>
      </OtherIfno>
    </Container>
  );
};

export default TxDetails;

const TxTopText = styled.div`
  padding: 3rem 0;
  p {
    text-align: center;
    margin-top: 0;
    margin-bottom: 5px;
    font-size: 14px;
    color: ${props => props.theme.data.textColor};
    &:first-child {
      font-weight: bold;
    }
  }
`;

const TxCard = styled.div`
  margin-top: 2rem;
  position: relative;
  text-align: center;
  background: #fff;
  margin: 0 10px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  padding-top: 2rem;
  img {
    position: absolute;
    top: -25px;
    left: 0;
    right: 0;
    width: 50px;
    margin: 0 auto;
  }
`;

const Amount = styled.div`
  font-weight: bold;
  text-align: center;
  padding: 1rem 0 0;
  color: ${props => props.theme.data.textColor};
`;

const FromAddress = styled.div`
  font-size: 11px;
  margin-top: 0.5rem;
`;

const SuccessStatus = styled.div`
  border-radius: 2px;
  padding: 0.2rem 1rem;
  margin-top: 1rem;
  display: inline-block;
  background: ${props => props.theme.data.lightGreen};
  color: ${props => props.theme.data.greenColor};
  font-weight: bold;
  font-size: 14px;
`;

const FailedStatus = styled.div`
  border-radius: 2px;
  padding: 0.2rem 1rem;
  margin-top: 1rem;
  display: inline-block;
  background: ${props => props.theme.data.lightRed};
  color: ${props => props.theme.data.redColor};
  font-weight: bold;
  font-size: 14px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 2rem;
  right: 1rem;
  border: 0;
  cursor: pointer;
  background: transparent;
  box-shadow: none;
  outline: none;
  font-size: 2rem;
`;

const TxData = styled.div`
  margin-top: 1.5rem;
`;

const TxBlock = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  color: ${props => props.theme.data.textColor};
  font-size: 12px;
  text-align: left;
`;

const OtherIfno = styled.div`
  background: #fff;
  padding: 1rem 0 0;
  margin: 1rem 10px;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.08);
  border-radius: 5px;
  ${TxData} {
    margin-top: 0.5rem;
  }
`;

const SideTitle = styled.h4`
  margin-top: 0;
  color: ${props => props.theme.data.textColor};
  padding: 0 0 0 1rem;
  margin-bottom: 0;
  position: relative;
  &:before {
    position: absolute;
    bottom: -0.3rem;
    left: 1rem;
    width: 1rem;
    height: 0.15rem;
    background: ${props => props.theme.data.blueColor};
    content: '';
  }
`;

// const PendingStatus = styled.div`
//   border-radius: 2px;
//   padding: 0.2rem 1rem;
//   margin-top: 1rem;
//   display: inline-block;
//   background: ${props => props.theme.data.lightYellow};
//   color: ${props => props.theme.data.yellowColor};
//   font-weight: bold;
//   font-size: 14px;
// `;

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  overflow-y: auto;
  background: ${props => props.theme.data.sideBarBg};
  border-left: 0.2px solid rgba(0, 0, 0, 0.4);
  z-index: -1;

  @media (max-width: 991px) {
    display: none;
    &.mobileOpen {
      display: block;
      width: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 999999;
      padding: 0 10px;
      ${TxTopText} {
        p {
          color: #fff;
        }
      }
      ${CloseBtn} {
        color: #fff;
      }
    }
  }
`;
