import React from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from '../store';
import QrReader from 'react-qr-reader';

const QRCodeScanner = () => {
  const { detailsModel: detailsState } = useStoreState(state => state);
  const { detailsModel: detailsActions } = useStoreActions(state => state);

  const closePopup = () => {
    detailsActions.setScanQRCodePopup(false);
  };

  const handleError = err => {
    console.log(err);
  };

  const handleScan = data => {
    if (data) {
      detailsActions.setWalletAddress(data);
      detailsActions.setScanQRCodePopup(false);
    }
  };
  return (
    <Container
      style={{ display: detailsState.scanQRCodePopup ? 'block' : 'none' }}
    >
      <ContainerInner>
        <QRCodeContainer>
          <Header>
            <Text>QR-Code scanner</Text>{' '}
            <CloseBtn onClick={closePopup}>&times;</CloseBtn>
          </Header>
          <ScannerContainer>
            {detailsState.scanQRCodePopup && (
              <QrReader
                delay={300}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
              />
            )}
          </ScannerContainer>
        </QRCodeContainer>
      </ContainerInner>
    </Container>
  );
};

export default QRCodeScanner;

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

const ScannerContainer = styled.div`
  padding: 30px;
`;
