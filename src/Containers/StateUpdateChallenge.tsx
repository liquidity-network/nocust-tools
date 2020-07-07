/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from '../store';
import Dropdown from '../Components/ui/Dropdown';
import BigNumber from 'bignumber.js';
import { nocust } from 'nocust-client';
import helper from '../utils/helper';
import moment from 'moment';

const StateUpdateChallenge = (props: any) => {
  const [selectedToken, setSelectedToken] = useState<any>();
  const [error, setError] = useState<string>('');
  const [tokens, setTokens] = useState<Array<any>>([]);
  const [notifications, setNotifications] = useState<Array<any>>();

  const { nocustModel: nocustState } = useStoreState((state) => state);
  const { nocustModel: nocustActions } = useStoreActions((state) => state);

  const getSelectedToken = async (selected: string) => {
    const short_name = selected.substr(1);
    const token = nocustState.supportedTokens.find(
      (x: any) => x.shortName === short_name
    );
    setSelectedToken(token);
  };

  const actionChecker = async () => {
    let notifcations: any[] = [];
    if (nocustState.notificationPayload.length > 0) {
      notifcations = await Promise.all(
        nocustState.notificationPayload.map(async (payload) => {
          const isInRecoveryMode = await nocust.isRecoveryMode();
          if (isInRecoveryMode) {
            payload.hubStatus = 'UNSAFE';
            payload.status = 'FAILED/CANCELLED';
            payload.message = 'Hub is in recovery mode';
          } else {
            payload.hubStatus = 'SAFE';
            if (payload.type.toLowerCase() === 'challenge') {
              const hasOutstandingChallenges = await nocust.hasOutstandingChallenges();
              console.log('hasOutstandingChallenges', hasOutstandingChallenges);

              if (hasOutstandingChallenges) {
                payload.status = 'PENDING';
                payload.message = 'Challenge agaist the hub still in progress';
              } else {
                payload.status = 'FAILED';
                payload.message =
                  'Hub is safe, challenge against the hub has failed!';
              }
            }
          }
          return payload;
        })
      );
    }
    setNotifications(notifcations);
  };

  const statusResolver = (status: string) => {
    if (status === 'SUCCESS' || status === 'SAFE') {
      return 'green';
    } else if (
      status === 'FAILED' ||
      status === 'FAILED/CANCELLED' ||
      status === 'UNSAFE'
    ) {
      return 'red';
    } else {
      return 'orange';
    }
  };

  const issueUpdateChallenge = async () => {
    try {
      setError('');
      const res = confirm(
        "You are about to initiate a state challenge update on-chain for the chosen currency. This operation cost about 300'000 gas plus a small fee."
      );
      if (res) {
        const onBalance = await nocust.getParentChainBalance(
          nocustState.walletInfo.walletAddress
        );

        if (onBalance.isGreaterThan(helper.CHALLENGE_FEES())) {
          nocustActions.setLoading(true);
          nocustActions.setLoadingMsg(
            'Initiating state update challenge, please wait....'
          );
          await nocust.issueStateUpdateChallenge({
            address: nocustState.walletInfo.walletAddress,
            gasPrice: new BigNumber('5000000000'),
            token:
              selectedToken.address || tokens.length > 0
                ? tokens[0].address
                : '',
          });

          nocustActions.setNotificationPayload({
            date: new Date(),
            type: 'challenge',
            hubStatus: 'SAFE',
            message: 'You have submitted a state update challenge',
            status: 'In progress',
            hubName: nocustState.selectedHub,
            token:
              selectedToken.shortName || tokens.length > 0
                ? tokens[0].shortName
                : '',
          });
        } else {
          throw new Error('Not enough Eth for gas fees');
        }
      } else {
        nocustActions.setLoading(false);
        nocustActions.setLoadingMsg('');
        return;
      }
    } catch (error) {
      console.log(error);
      setError(
        `Cannot initiate state update challenge, ${error.description || error}`
      );
    } finally {
      nocustActions.setLoadingMsg('');
      nocustActions.setLoading(false);
    }
  };

  const initNocust = async (hub: string) => {
    await nocustActions.initNocust(hub);
    const walletInfo = localStorage.getItem('walletInfo');
    if (walletInfo && !nocustState.walletImported) {
      importWallet();
    }
  };

  const importWallet = async () => {
    await nocustActions.importWallet({
      seedPhrase: nocustState.walletInfo.seedPhrase,
      hubName: nocustState.selectedHub,
    });
  };

  useEffect(() => {
    initNocust(nocustState.selectedHub);
    //  eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (nocustState.supportedTokens.length > 0) {
      setTokens(nocustState.supportedTokens);
      setSelectedToken(nocustState.supportedTokens[0]);
    }
  }, [nocustState.supportedTokens]);

  useEffect(() => {
    if (
      (nocustState.isNocustInitialized,
      nocustState.walletImported && nocustState.notificationPayload.length > 0)
    ) {
      actionChecker();
    }
    // eslint-disable-next-line
  }, [
    nocustState.isNocustInitialized,
    nocustState.walletImported,
    nocustState.notificationPayload,
  ]);

  return (
    <Container>
      <ContainerInner>
        <Content>
          <Title>
            Liquidity Network Watch Tower <br /> State update challenge
          </Title>
          <Intro>
            Liquidity Network's hubs form a trustless off-chain payment system.
            Their security relies on actively monitoring the hub's behaviour.
            Your wallet takes care of this for you and keeps your funds safe.
          </Intro>
          <Step>
            {nocustState.loading ? (
              <LoadingMsg>{nocustState.loadingMsg}</LoadingMsg>
            ) : (
              <>
                <DropdownContainer>
                  <Dropdown
                    items={tokens.map((x) => `f${x.shortName}`)}
                    itemSelected={
                      selectedToken ? `f${selectedToken.shortName}` : 'fETH'
                    }
                    padding={'10px 20px'}
                    fontSize={'17px'}
                    extraWord={'Currency: '}
                    getSelectedItem={getSelectedToken}
                  />
                </DropdownContainer>
                <Info>
                  <div>
                    <span>Hub address:</span>{' '}
                    {tokens.length > 0
                      ? selectedToken
                        ? selectedToken.address
                        : tokens[0].address
                      : ''}
                  </div>
                </Info>
                <ErrorMsg>
                  {error && <span style={{ color: 'red' }}>{error}</span>}
                </ErrorMsg>

                <BlocksContainer>
                  {notifications && notifications.length > 0 ? (
                    <>
                      <Intro>Latest challenges submitted by this wallet</Intro>
                      <br />
                      {notifications.map((item) => (
                        <NotificationBlock key={item.type}>
                          <NotificationTitle>
                            <NotifiTitle>
                              {' '}
                              Type: <span>{item.type}</span>
                            </NotifiTitle>
                            <SideDate>
                              {moment(item.date).format('YYYY-MM-DD')}
                            </SideDate>
                          </NotificationTitle>
                          <Message>{item.message}</Message>
                          <FlexBox>
                            <Token>
                              Challenge Status:{' '}
                              <span
                                className="pending"
                                style={{ color: statusResolver(item.status) }}
                              >
                                {item.status}
                              </span>
                            </Token>
                          </FlexBox>
                          <FlexBox>
                            <Token>
                              Token: <span>{item.token}</span>
                            </Token>
                            <HubStatus>
                              Hub Status:{' '}
                              <span
                                className="safe"
                                style={{
                                  color: statusResolver(item.hubStatus),
                                }}
                              >
                                {item.hubStatus}
                              </span>
                            </HubStatus>
                          </FlexBox>
                        </NotificationBlock>
                      ))}
                    </>
                  ) : (
                    ''
                  )}
                </BlocksContainer>

                <BtnContainer>
                  <SubmitButton onClick={issueUpdateChallenge}>
                    Initiate state update challenge
                  </SubmitButton>
                </BtnContainer>
              </>
            )}
          </Step>
        </Content>
      </ContainerInner>
    </Container>
  );
};

export default StateUpdateChallenge;

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

const Content = styled.div``;

const Title = styled.div`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  color: #272727;
`;

const Intro = styled.div`
  font-size: 13px;
  margin-top: 2rem;
  text-align: center;
`;

const DropdownContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const Info = styled.div`
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  padding: 1.2rem;
  background: rgb(243, 247, 254);
  > div {
    margin-bottom: 1rem;

    &:last-child {
      margin-bottom: 0;
    }

    > span {
      font-weight: bold;
      &:first-child {
        color: #3682dd;
      }
    }
  }
`;

const SubmitButton = styled.div`
  cursor: pointer;
  border: 0;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${(props) => props.theme.data.lightBlueColor};
  border: 1px solid ${(props) => props.theme.data.blueColor};
  color: ${(props) => props.theme.data.blueColor};
  border-radius: 25px;
  padding: 0.7rem 2.5rem;
  font-size: 16px;
  max-width: 100%;
  display: inline-block;
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

const BtnContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const Step = styled.div``;

const ErrorMsg = styled.div`
  text-align: center;
  font-size: 12px;
`;

const LoadingMsg = styled.div`
  padding: 2rem 1rem;
  margin: 2rem 0;
  text-align: center;
  font-weight: bold;
  font-size: 14px;
  color: #3682dd;
  background: #f3f7fe;
  border-radius: 5px;
`;

const NotificationBlock = styled.div`
  border: 1px solid #3682dd;
  background: #fff;
  border-radius: 5px;
  padding: 1rem;
  min-width: 320px;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const NotificationTitle = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NotifiTitle = styled.div`
  span {
    font-weight: bold;
    color: #3682dd;
    text-transform: capitalize;
  }
`;

const SideDate = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const Message = styled.div`
  font-size: 13px;
  margin: 0.7rem 0 0.9rem;
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  align-items: center;
`;

const Token = styled.div`
  font-size: 13px;
  span {
    font-weight: bold;
    color: #3682dd;

    &.pending {
      color: orange;
    }
  }
`;

const HubStatus = styled.div`
  font-size: 13px;
  .safe {
    color: green;
    font-weight: bold;
  }
`;

const BlocksContainer = styled.div`
  max-height: 77vh;
  overflow-y: auto;
  padding: 1rem;
`;

// const SmallText = styled.div`
//   min-width: 320px;
//   font-size: 14px;
//   text-align: center;
// `;
