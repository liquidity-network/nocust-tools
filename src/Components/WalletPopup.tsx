import React from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode.react';
import { useStoreState, useStoreActions } from '../store';

const WalletPopup = () => {
  const { detailsModel: detailsState } = useStoreState(state => state);
  const { detailsModel: detailsActions } = useStoreActions(state => state);

  const closePopup = () => {
    detailsActions.setQrPopupOpened(false);
  };

  return (
    <Container
      style={{ display: detailsState.qrPopupOpened ? 'block' : 'none' }}
    >
      <ContainerInner>
        <QRCodeContainer>
          <Header>
            <Text>Address QR-Code</Text>{' '}
            <CloseBtn onClick={closePopup}>&times;</CloseBtn>
          </Header>

          <CenterText>
            <Blue>Etherum Address</Blue>
            <Address>{detailsState.walletAddress}</Address>
          </CenterText>
          <DQRCode
            value={detailsState.walletAddress}
            size={150}
            className={'qrcode'}
          />
        </QRCodeContainer>
      </ContainerInner>
    </Container>
  );
};

export default WalletPopup;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999999;
  padding: 0 10px;
`;

const ContainerInner = styled.div`
  display: flex;
  width: 100%;
  min-height: 100%;
  justify-content: center;
  align-items: center;
`;

const QRCodeContainer = styled.div`
  border-radius: 5px;
  background: #fff;
  width: 500px;
  padding: 20px;
  @media (max-width: 500px) {
    width: 90%;
  }
`;

const Header = styled.div`
  width: 100%;
  display: flex;
`;

const Text = styled.div`
  flex: 0 0 95%;
`;

const CloseBtn = styled.button`
  outline: none;
  padding: 0;
  margin: 0;
  background: none;
  border: 0;
  box-shadow: none;
  font-size: 20px;
  cursor: pointer;
  display: inline-block;
  margin-left: auto;
`;

const CenterText = styled.div`
  text-align: center;
  margin: 2rem 0;
`;

const Blue = styled.div`
  color: ${props => props.theme.data.blueColor};
  font-weight: bold;
`;

const Address = styled.div`
  color: ${props => props.theme.data.textColor};
  margin-top: 1rem;
  font-size: 13px;
`;

const DQRCode = styled(QRCode)`
  text-align: center;
  display: block;
  margin: 0 auto;
  margin-bottom: 20px;
`;
