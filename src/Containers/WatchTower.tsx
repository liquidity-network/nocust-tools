/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dropdown from '../Components/ui/Dropdown';
import { HubNames } from '../model/hubModel';
import { useStoreState, useStoreActions } from '../store';
import { Link } from 'react-router-dom';

const WatchTower = (props: any) => {
  const { nocustModel: nocustState } = useStoreState((state) => state);
  const { nocustModel: nocustActions } = useStoreActions((state) => state);
  const walletData = localStorage.getItem('walletInfo');
  const [steps, setSteps] = useState(0);

  const [seedPhrase, setSeedPhrase] = useState(
    walletData ? JSON.parse(walletData).seedPhrase : ''
  );
  const [hub, setSelectedHub] = useState<string>('RINKEBY');
  const [version, setVersion] = useState<string>('2.0');
  const [error, setError] = useState<string>('');

  const getSelectedHub = (selected) => {
    setSelectedHub(selected);
    nocustActions.setSelectedHub(selected);
    initNocust(selected);
  };

  const getSelectedVersion = (selected) => {
    setVersion(selected);
  };

  const initNocust = async (hub: string) => {
    await nocustActions.initNocust(hub);
    const walletInfo = localStorage.getItem('walletInfo');
    if (walletInfo && !nocustState.walletImported) {
      importWallet();
    }

    if (nocustState.walletImported) {
      setSteps(1);
    }
    // console.log(
    //   runErrorChecker(
    //     '0x4628cc6c2ced58e6a53298744dd321bfeb520a97f127e5b593a9f64839312571'
    //   )
    // );
  };

  const importWallet = async () => {
    setError('');
    try {
      if (seedPhrase === '') {
        setError('Please enter your seedPhrase');
        return;
      }
      nocustActions.setLoading(true);
      await nocustActions.importWallet({
        seedPhrase,
        hubName: hub,
      });
      nocustActions.setWalletImported(true);
      nocustActions.setLoading(false);

      setSteps(1);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      nocustActions.setLoading(false);
    }
  };

  // const runErrorChecker = async (txHash: string) => {
  //   const revertId = '0x08c379a0';
  //   const tx: any = await web3.eth.getTransaction(txHash);
  //   console.log('tx', tx);
  //   if (!tx) {
  //     throw new Error('The transaction does not exist');
  //   }

  //   const txResult = await web3.eth.call(tx, tx.blockNumber);

  //   console.log('txResult', txResult);

  //   console.log(web3.utils.hexToAscii('0x' + txResult.slice(revertId.length)));

  //   if (txResult.search(revertId) === -1) {
  //     throw new Error('The transaction did not revert');
  //   }

  //   return web3.utils.hexToAscii('0x' + txResult.slice(revertId.length));
  // };

  const wipeWallet = () => {
    const res = confirm(
      'You are about to clear your storage from your wallet info, this will cause deleting your wallet notification messages as well, Still want to wipe your wallet?'
    );
    if (res) {
      localStorage.clear();
      window.location.reload();
    }
  };

  useEffect(() => {
    initNocust(nocustState.selectedHub);
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <ContainerInner>
        <Content>
          <Title>Liquidity Network Watch Tower</Title>
          <Intro>
            Watch Tower is a tool that helps you to perform nocust operations
            like challenge nocust hub, withdraw a wallet funds, or recover a
            wallet funds in case of a dead hub
          </Intro>

          <Flex>
            <Status>
              Hub Name: <span>{nocustState.selectedHub}</span>
            </Status>
            <Status>
              Hub Status:{' '}
              {nocustState.isRecoveryMode ? (
                <span style={{ color: 'red' }}>UNSAFE</span>
              ) : (
                <span style={{ color: 'green' }}>SAFE</span>
              )}
            </Status>
          </Flex>

          {steps === 0 && (
            <Step>
              {/* <button onClick={runErrorChecker}>Run ErrorChecker</button> */}
              {nocustState.loading ? (
                <LoadingMsg>{nocustState.loadingMsg}</LoadingMsg>
              ) : (
                <>
                  <DropDownContainer>
                    <Dropdown
                      items={Object.keys(HubNames)}
                      itemSelected={hub}
                      padding={'8px 20px'}
                      fontSize={'17px'}
                      extraWord={'Choose hub: '}
                      getSelectedItem={getSelectedHub}
                    />

                    <Dropdown
                      items={['2.0']}
                      itemSelected={version}
                      padding={'10px 20px'}
                      fontSize={'17px'}
                      extraWord={'Nocust version: Nocust '}
                      getSelectedItem={getSelectedVersion}
                    />
                  </DropDownContainer>
                  <SeedContainer>
                    <SeedTitle>Seed phrase</SeedTitle>
                    <textarea
                      placeholder={'Enter your seed phrase'}
                      onChange={(e: any) => setSeedPhrase(e.target.value)}
                    ></textarea>
                  </SeedContainer>

                  <ErrorMsg>
                    {error && <span style={{ color: 'red' }}>{error}</span>}
                  </ErrorMsg>
                  <BtnContainer>
                    <SubmitButton onClick={importWallet}>
                      Import wallet
                    </SubmitButton>
                  </BtnContainer>
                </>
              )}
            </Step>
          )}

          {steps === 1 && (
            <Step>
              <Stored>
                <StoredTitle>
                  <Text>Stored wallet</Text>{' '}
                  <WipeBtn onClick={() => wipeWallet()}>Wipe wallet</WipeBtn>
                </StoredTitle>
                <StoredBlock>
                  {nocustState.walletInfo.walletAddress}
                </StoredBlock>
              </Stored>
              <BtnsContainer>
                {!nocustState.isRecoveryMode ? (
                  <>
                    <ButtonBlock>
                      <Link to="/watchtower/withdraw">
                        Withdraw wallet funds
                      </Link>
                    </ButtonBlock>
                    <ButtonBlock>
                      <Link to="/watchtower/challenge">
                        Initiate state update challenge
                      </Link>
                    </ButtonBlock>
                  </>
                ) : (
                  <ButtonBlock>
                    <Link to="/watchtower/recovery">Recovery wallet funds</Link>
                  </ButtonBlock>
                )}
              </BtnsContainer>
            </Step>
          )}
        </Content>
      </ContainerInner>
    </Container>
  );
};

export default WatchTower;

const Container = styled.div`
  background: #fff;
  width: 100%;
  min-height: 100vh;
`;

const DropDownContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  > div {
    margin-top: 2rem;
  }
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
const Text = styled.div`
  font-size: 14px;
  font-weight: bold;
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

const SeedContainer = styled.div`
  max-width: 400px;
  width: 100%;
  margin: 2rem auto;
  textarea {
    border-radius: 5px;
    padding: 1rem;
    border: 1px solid #3682dd;
    width: 100%;
    height: 80px;
    resize: none;
    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  }
`;

const SeedTitle = styled.div`
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 1rem;
`;

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

const BtnsContainer = styled.div`
  width: 300px;
  margin: 2rem auto;
`;

const ButtonBlock = styled.div`
  cursor: pointer;
  padding: 12px 0;
  border-radius: 5px;
  color: #fff;
  background: #3682dd;
  text-align: center;
  margin: 1rem auto;
  font-size: 16px;
  a {
    color: inherit;
    display: block;
  }
`;

const Stored = styled.div`
  margin: 1rem 0;
`;

const StoredTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7rem;
  font-size: 14px;
  margin-top: 2rem;
`;

const WipeBtn = styled.div`
  cursor: pointer;
  color: #3682dd;
`;

const StoredBlock = styled.div`
  border-radius: 5px;
  padding: 1rem;
  text-align: center;
  background: #f3f7fe;
`;

const Status = styled.div`
  text-align: center;
  margin-top: 3rem;
  span {
    font-weight: bold;
  }
`;

const Flex = styled.div`
  display: flex;
  justify-content: space-between;
`;
