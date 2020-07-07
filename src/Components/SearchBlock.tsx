import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import styled from 'styled-components';
import Logo from '../assets/images/main-logo.svg';
import Dropdown from './ui/Dropdown';
import { Link } from 'react-router-dom';
import { useStoreActions, useStoreState } from '../store';
import { HubNames, HubURLS } from '../model/hubModel';
import QrCode from '../assets/images/qr.svg';
import ReactTooltip from 'react-tooltip';

const SearchBlock = (props: any) => {
  const { hubModel: hubState, detailsModel: detailsState } = useStoreState(
    (state) => state
  );
  const {
    hubModel: hubActions,
    transferModel: transferActions,
    detailsModel: detailsActions,
    analyticsModel: analyticsActions,
  } = useStoreActions((state) => state);

  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const getSelectedItem = (item: string) => {
    const hubURL = HubURLS[item];
    hubActions.setSelectedHub(item);
    analyticsActions.fetchHubTokens(hubURL);
  };

  const handleSearch = () => {
    if (!query) {
      setError('Please enter a search query');
      return;
    }
    const web3 = new Web3();
    try {
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
      props.history.push(
        `/details/${hubState.selectedHub.toLowerCase()}/${queryParam}`
      );
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };
  useEffect(() => {
    setQuery('');
    hubActions.setHideLogo(true);
    transferActions.setIsSideOpen(false);
    hubActions.setHideDropdown(true);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setQuery(detailsState.walletAddress);
  }, [detailsState.walletAddress]);

  useEffect(() => {
    if (hubState.selectedHub) {
      const hubURL = HubURLS[hubState.selectedHub];
      analyticsActions.fetchHubTokens(hubURL);
    }
    // eslint-disable-next-line
  }, [hubState.selectedHub]);
  return (
    <Container>
      <InnerContainer>
        <MainLogo>
          <img src={Logo} alt="" />
        </MainLogo>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="Search for things like wallet address, transaction id"
            name="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {error && <ErrMsg>{error}</ErrMsg>}
          <QrContainer
            data-tip={'QR Code scanner'}
            onClick={() => detailsActions.setScanQRCodePopup(true)}
          >
            <QRBtn>
              <img src={QrCode} alt="" />
            </QRBtn>
          </QrContainer>
          <ReactTooltip />
          <DropDownContainer>
            <Dropdown
              items={Object.keys(HubNames)}
              itemSelected={hubState.selectedHub}
              padding={'12px 20px'}
              fontSize={'17px'}
              getSelectedItem={getSelectedItem}
            />
          </DropDownContainer>
        </SearchContainer>

        <BtnContainer>
          <SearchBtn onClick={handleSearch}>Search</SearchBtn>
          <DashboardBtn>
            <Link to={'/dashboard'}>Dashboard</Link>
          </DashboardBtn>
        </BtnContainer>
      </InnerContainer>
    </Container>
  );
};

export default SearchBlock;

const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.div`
  width: 700px;
  @media (max-width: 991px) {
    width: 100%;
    padding: 0 1.5rem;
  }
`;

const MainLogo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  img {
    width: 250px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  border-radius: 25px;
  border: 1px solid ${(props) => props.theme.data.inputBorderColor};
  padding: 15px 130px 15px 60px;
  box-shadow: none;
  outline: none;
  text-shadow: none;
  background: #fff;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 1rem;
  &:focus {
    border-color: ${(props) => props.theme.data.blueColor};
  }
`;

const DropDownContainer = styled.div`
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  @media (max-width: 500px) {
    top: 0.15rem;
  }
`;

const BtnContainer = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

const SearchBtn = styled.button`
  box-shadow: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;

  background: ${(props) => props.theme.data.blueColor};
  color: #fff;
  border: 1px solid transparent;
  display: block;
  border-radius: 25px;
  padding: 0.7rem 0;
  font-size: 17px;
  width: 12rem;
  display: inline-block;
  &:hover {
    background: ${(props) => props.theme.data.lightBlueColor};
    border: 1px solid ${(props) => props.theme.data.blueColor};
    color: ${(props) => props.theme.data.blueColor};
  }
  @media (max-width: 500px) {
    width: 9rem;
    padding: 0.6rem 0;
  }
`;

const DashboardBtn = styled.button`
  border: 0;
  box-shadow: none;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 25px;
  background: none;
  a {
    background: ${(props) => props.theme.data.lightBlueColor};
    color: ${(props) => props.theme.data.textColor};
    border: 1px solid transparent;
    display: block;
    border-radius: 25px;
    padding: 0.7rem 0;
    font-size: 17px;
    width: 12rem;
    @media (max-width: 500px) {
      width: 9rem;
      padding: 0.6rem 0;
    }
  }
  &:hover {
    a {
      background: ${(props) => props.theme.data.lightBlueColor};
      border: 1px solid ${(props) => props.theme.data.blueColor};
      color: ${(props) => props.theme.data.blueColor};
    }
  }
`;

const ErrMsg = styled.span`
  color: red;
  font-size: 12px;
`;

const QrContainer = styled.div`
  position: absolute;
  top: 5px;
  left: 5px;
`;

const QRBtn = styled.button`
  border: none;
  box-shadow: none;
  outline: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  background: ${(props) => props.theme.data.lightBlueColor};
  border: 1px solid ${(props) => props.theme.data.blueColor};
  img {
    width: 20px;
    margin-top: 7px;
  }
`;
