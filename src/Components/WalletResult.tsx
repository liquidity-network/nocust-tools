import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import styled from 'styled-components';
import QrCode from '../assets/images/qr.svg';
import { useStoreState, useStoreActions } from '../store';
import Dropdown from './ui/Dropdown';
import { HubURLS } from '../model/hubModel';
import UserTx from './UserTx';
import DTable from './DTable';
import { fetchWalletTokensBalances } from '../utils/web3Utils';
import Loader from '../Components/ui/Loader';

const WalletResult = (props: any) => {
  const {
    detailsModel: detailsState,
    analyticsModel: analyticsState,
  } = useStoreState((state) => state);
  const {
    detailsModel: detailsActions,
    analyticsModel: analyticsActions,
  } = useStoreActions((state) => state);
  const [eonsIteration, setEonsIteration] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [didMount, setDidMount] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [userTransfers, setUserTransfers] = useState([]);
  const [tokenBalances, setTokenBalances] = useState<any>({});
  const [transferType, setTransferType] = useState('Transfers');
  const [searchData, setSearchData] = useState({ hub: '', query: '' });
  const [isFetching, setIsFetching] = useState(false);
  const openPopup = () => {
    detailsActions.setQrPopupOpened(true);
    detailsActions.setWalletAddress(searchData.query);
  };

  const getSelectedToken = (selectedToken: string) => {
    if (selectedToken === 'All Tokens') {
      setTokens(analyticsState.hubTokens);
    } else {
      const selected = analyticsState.hubTokens.filter(
        (token: any) => token.short_name === selectedToken
      );
      setTokens(selected);
    }
  };

  const getSelectedTransferType = (selectedTransferType: string) => {
    setTransferType(selectedTransferType);
    setUserTransfers(
      detailsState.transfers[selectedTransferType.toLowerCase()]
    );
  };

  const getSelectedTransferToken = (selectedTransferToken: string) => {
    if (selectedTransferToken === 'All Tokens') {
      setUserTransfers(detailsState.transfers[transferType.toLowerCase()]);
    } else {
      const selectedToken: any = analyticsState.hubTokens.find(
        (token: any) => token.short_name === selectedTransferToken
      );
      const filteredArray = detailsState.transfers[
        transferType.toLowerCase()
      ].filter((token: any) => token.wallet.token === selectedToken.address);

      setUserTransfers(filteredArray);
    }
  };

  const returnCapitalizedNames = () => {
    const array: Array<string> = Object.keys(detailsState.transfers).map(
      (name: string) => name.charAt(0).toUpperCase() + name.slice(1)
    );
    return array;
  };

  const returnWalletBalances = (short_name) => {
    if (analyticsState.tokensBalances.length > 0) {
      const tkData: any = analyticsState.tokensBalances.find(
        (tk: any) => tk.token === short_name
      );
      const fiatBalance = tkData.fiatPrice * Number(tokenBalances[short_name]);
      return fiatBalance.toFixed(3);
    }
  };

  const returnTotalFiatPrice = () => {
    let total = 0;
    if (analyticsState.tokensBalances.length > 0 && tokenBalances) {
      analyticsState.tokensBalances.forEach((tk: any) => {
        const fiatBalance = Number(tokenBalances[tk.token]) * tk.fiatPrice;
        total = total + fiatBalance;
      });
      return total.toFixed(3);
    }
  };

  const fetchEons = (currentEon: number) => {
    const iterations: Array<string> = [];

    if (10 >= currentEon) {
      iterations.push(`0 - ${currentEon}`);
    } else {
      const iterator = currentEon % 5;
      console.log(iterator);

      for (let i = currentEon; i > 5; i--) {
        if ((i - 5) % 5 === iterator) {
          iterations.push(`${i - 5 < 5 ? 0 : i - 5} - ${i}`);
        }
      }
    }
    setEonsIteration(iterations);
  };

  const checkSumChecker = (query: string) => {
    const web3 = new Web3();
    let queryParam: any;
    if (query.startsWith('0x')) {
      const isValid = web3.utils.checkAddressChecksum(query);
      if (!isValid) {
        queryParam = web3.utils.toChecksumAddress(query);
      } else {
        queryParam = query;
      }
    } else {
      queryParam = query;
    }
    return queryParam;
  };

  useEffect(() => {
    setDidMount(true);
    const { hub, query } = props.match.params;

    setSearchData({ hub, query: checkSumChecker(query) });
    if (hub) {
      analyticsActions.fetchHubTokens(HubURLS[hub.toUpperCase()]);
      analyticsActions.fetchHubStatus(HubURLS[hub.toUpperCase()]);
    }
    return () => setDidMount(false);
    //  eslint-disable-next-line
  }, []);

  useEffect(() => {
    setDidMount(true);
    if (analyticsState.currentRound) {
      fetchEons(analyticsState.currentRound);
    }
    return () => setDidMount(false);
    //  eslint-disable-next-line
  }, [analyticsState.currentRound]);

  const getBalance = async (tokenAddress: string, hubAddress: string) => {
    const balance = await fetchWalletTokensBalances(
      searchData.hub,
      searchData.query,
      tokenAddress,
      hubAddress
    ).then((result) => result);
    return balance;
  };

  const loadTransfers = (selectedRange) => {
    const ethToken: any = analyticsState.hubTokens.find(
      (token: any) => token.short_name === 'ETH'
    );
    const hubAddress = ethToken ? ethToken.address : undefined;

    analyticsState.hubTokens.forEach(async (singleToken: any) => {
      detailsActions.fetchUserTransfers({
        token: singleToken.address,
        address: checkSumChecker(props.match.params.query),
        hubUrl: HubURLS[searchData.hub.toUpperCase()],
        eons: selectedRange,
      });
      const balance = await getBalance(singleToken.address, hubAddress);
      const balanceToken = { [singleToken.short_name]: balance };
      setTokenBalances((prevState) => {
        return { ...prevState, ...balanceToken };
      });
    });
  };

  useEffect(() => {
    setTokens(analyticsState.hubTokens);

    if (
      !isFetching &&
      analyticsState.hubTokens.length > 0 &&
      searchData.query &&
      eonsIteration.length > 0
    ) {
      setIsFetching(true);
      setLoading(false);
      loadTransfers(eonsIteration[0]);
      setIsFetching(false);
    }

    //  eslint-disable-next-line
  }, [analyticsState.hubTokens]);

  useEffect(() => {
    setUserTransfers(detailsState.transfers.transfers);
  }, [detailsState.transfers]);

  if (!didMount) {
    return null;
  }

  const getSelectedIteration = (selected: string) => {
    loadTransfers(selected);
  };

  return (
    <>
      <AddressHolder>
        <span>
          <b>Address:</b> {searchData.query}
        </span>
        <QrcodeBtn onClick={openPopup}>
          <img src={QrCode} alt="" />
        </QrcodeBtn>
      </AddressHolder>
      {!loading && (
        <TokenHolder>
          <Heading>
            <LeftHeading>
              <b>Token Balances</b> - {analyticsState.hubTokens.length} Tokens
            </LeftHeading>
            <RightData>
              <DataText>Total: $ {returnTotalFiatPrice()}</DataText>
              <DropDownContainer>
                {tokens.length > 0 && (
                  <Dropdown
                    items={[
                      'All Tokens',
                      ...analyticsState.hubTokens.map(
                        (token: any) => token.short_name
                      ),
                    ]}
                    itemSelected={'All Tokens'}
                    padding={'7px 15px'}
                    fontSize={'13px'}
                    getSelectedItem={getSelectedToken}
                  />
                )}
              </DropDownContainer>
            </RightData>
          </Heading>

          <TableContainer>
            <Table className="token-table">
              <Tbody>
                {tokens.map((token: any, index: number) => {
                  return (
                    <Tr key={index}>
                      <Td>
                        {token.name} ({token.short_name})
                      </Td>
                      <Td>
                        {tokenBalances[token.short_name] &&
                          tokenBalances[token.short_name]}{' '}
                        {token.short_name} - ${' '}
                        {returnWalletBalances(token.short_name)}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </TokenHolder>
      )}

      {loading && <Loader width={'120'} />}

      {!loading && (
        <TransfersContainer>
          <TransferHead>
            <LeftCol>
              <b>Transfers</b>
            </LeftCol>
            <RightCol>
              <Text>{userTransfers.length} Total</Text>
              <DropdownContainer>
                {eonsIteration.length > 0 && (
                  <Dropdown
                    items={eonsIteration}
                    extraWord={'Eon'}
                    itemSelected={eonsIteration[0]}
                    padding={'7px 15px'}
                    fontSize={'13px'}
                    getSelectedItem={getSelectedIteration}
                  />
                )}
              </DropdownContainer>
              <DropdownContainer>
                {tokens.length > 0 && transferType === 'Transfers' && (
                  <Dropdown
                    items={[
                      'All Tokens',
                      ...analyticsState.hubTokens.map(
                        (token: any) => token.short_name
                      ),
                    ]}
                    itemSelected={'All Tokens'}
                    padding={'7px 15px'}
                    fontSize={'13px'}
                    getSelectedItem={getSelectedTransferToken}
                  />
                )}
              </DropdownContainer>
              <DropdownContainer>
                <Dropdown
                  items={returnCapitalizedNames()}
                  itemSelected={returnCapitalizedNames()[1]}
                  padding={'7px 15px'}
                  fontSize={'13px'}
                  getSelectedItem={getSelectedTransferType}
                />
              </DropdownContainer>
            </RightCol>
          </TransferHead>
          {detailsState.isLoading ? (
            <Loader width={'120'} />
          ) : transferType === 'Transfers' ? (
            <UserTx
              data={userTransfers.reverse()}
              walletAddress={searchData.query}
            />
          ) : (
            <DTable data={userTransfers.reverse()} />
          )}
        </TransfersContainer>
      )}
    </>
  );
};

export default WalletResult;

const AddressHolder = styled.div`
  max-width: 800px;
  border: 1px solid ${(props) => props.theme.data.blueColor};
  border-radius: 3px;
  padding: 20px;
  margin: 4rem auto;
  position: relative;
  text-align: center;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const QrcodeBtn = styled.button`
  outline: none;
  box-shadow: none;
  background: none;
  border: 0;
  position: absolute;
  top: 14px;
  right: 10px;
  padding: 0;
  cursor: pointer;
  img {
    width: 30px;
  }
  @media (max-width: 500px) {
    top: 8px;
    img {
      width: 20px;
    }
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const Tr = styled.tr`
  padding: 5px;
`;
const Td = styled.td`
  padding-top: 0.7rem;
  padding-bottom: 0.7rem;
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
  }
  @media (max-width: 991px) {
    font-size: 13px;
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

const Table = styled.table`
  border: 0;
  border-collapse: collapse;
  width: 100%;
  &.token-table {
    td:nth-child(2) {
      text-align: right;
    }
  }
`;

const TokenHolder = styled.div`
  margin: 6rem 0;
`;

const Heading = styled.div`
  display: flex;
`;

const LeftHeading = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding-top: 8px;
  @media (max-width: 991px) {
    font-size: 14px;
  }
`;

const RightData = styled.div`
  margin-left: auto;
  display: inline-block;
  vertical-align: middle;
`;

const DataText = styled.div`
  display: inline-block;
  vertical-align: middle;
  font-size: 13px;
  @media (max-width: 600px) {
    position: relative;
    top: 5px;
  }
`;

const DropDownContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  @media (max-width: 991px) {
    display: none;
  }
`;

const TransfersContainer = styled.div``;

const TransferHead = styled.div`
  display: flex;
`;

const LeftCol = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding-top: 7px;
`;

const RightCol = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: auto;
`;

const Text = styled.div`
  color: ${(props) => props.theme.data.textColor};
  display: inline-block;
  vertical-align: middle;
  @media (max-width: 600px) {
    display: none;
  }
`;

const DropdownContainer = styled.div`
  display: inline-block;
  margin-left: 10px;
  vertical-align: middle;
`;
