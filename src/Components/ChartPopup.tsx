import React from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from '../store';
import { Line } from 'react-chartjs-2';
import chartsStyle from '../utils/constants';

const ChartPopup = () => {
  const { analyticsModel: analyticsState } = useStoreState(state => state);
  const { analyticsModel: analyticsActions } = useStoreActions(state => state);

  const closePopup = () => {
    analyticsActions.setOpenChartPopup(false);
  };

  return (
    <Container
      style={{ display: analyticsState.openChartPopup ? 'block' : 'none' }}
    >
      <ContainerInner>
        <QRCodeContainer>
          <Header>
            <Text>Chart indicators</Text>{' '}
            <CloseBtn onClick={closePopup}>&times;</CloseBtn>
          </Header>
          <ChartContainer>
            {analyticsState.chartType === 'transfers' && (
              <Line
                data={{
                  labels: analyticsState.transfersDays,
                  datasets: [
                    {
                      ...chartsStyle,
                      label: 'Transfers',
                      data: analyticsState.transfersCount
                    }
                  ]
                }}
              />
            )}

            {analyticsState.chartType === 'wallets' && (
              <Line
                data={{
                  labels: analyticsState.walletsEons,
                  datasets: [
                    {
                      ...chartsStyle,
                      label: 'Wallets',
                      data: analyticsState.walletsCount
                    }
                  ]
                }}
              />
            )}
          </ChartContainer>
        </QRCodeContainer>
      </ContainerInner>
    </Container>
  );
};

export default ChartPopup;

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
  width: 1170px;
  padding: 20px;
  @media (max-width: 500px) {
    width: 95%;
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

const ChartContainer = styled.div`
  padding: 0px;
`;
