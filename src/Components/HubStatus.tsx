import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import { useStoreActions, useStoreState } from '../store';
import Loader from './ui/Loader';

const HubStatus = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const { hubModel: hubActions } = useStoreActions(state => state);
  const { hubModel: hubState } = useStoreState(state => state);

  const updateStatusListLength = () => {
    setWidth(window.innerWidth);
    switch (true) {
      case width < 600:
        hubActions.setListLength(24);
        break;
      case width < 850:
        hubActions.setListLength(48);
        break;
      case width < 1100:
        hubActions.setListLength(72);
        break;
      default:
        hubActions.setListLength(96);
    }
  };

  useEffect(() => {
    updateStatusListLength();
    window.addEventListener('resize', updateStatusListLength);
    return () => window.removeEventListener('resize', updateStatusListLength);
    // eslint-disable-next-line
  }, [width]);

  return (
    <>
      {hubState.isLoading ? (
        <Loader />
      ) : (
        <StatusData>
          <StatusText>
            Availability Over Time {hubState.availability.toFixed(2)} %
          </StatusText>
          <BarsContainer>
            <StatusBars>
              {hubState.statusList
                .slice(0, hubState.listLength)
                .reverse()
                .map((item: any, i: number) => {
                  return (
                    <BlockState
                      key={i}
                      style={{ background: hubState.statusColor[item.status] }}
                      data-tip={`${hubState.listLength - i} hours ago (${
                        item.status
                      })`}
                    ></BlockState>
                  );
                })}
            </StatusBars>
            <ReactTooltip />
          </BarsContainer>
        </StatusData>
      )}
    </>
  );
};

export default HubStatus;

const StatusData = styled.div`
  background: #fff;
  border-radius: 5px;
  padding: 2.5rem 1.8rem;
  text-align: center;
  margin-top: 2rem;
`;

const StatusText = styled.p`
  text-align: center;
  margin-top: 0;
`;

const BarsContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 2rem;
`;

const StatusBars = styled.div``;

const BlockState = styled.div`
  width: 10.1px;
  height: 2rem;
  border-radius: 2px;
  background: ${props => props.theme.data.statusGreen};
  display: inline-block;
  vertical-align: middle;
  margin-right: 1px;
  &:last-child {
    margin-right: 0;
  }

  &.offline {
    background: ${props => props.theme.data.statusGray};
  }
`;
