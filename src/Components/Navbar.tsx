import React from 'react';
import styled from 'styled-components';
import NavbarLogo from '../assets/images/navbar-logo.svg';
import { Link, NavLink } from 'react-router-dom';
import { useStoreState } from '../store';

const Navbar = () => {
  const { transferModel: trasnferState, hubModel: hubState } = useStoreState(
    (state) => state
  );

  return (
    <Container
      className={
        trasnferState.isSideOpen && window.innerWidth > 991 ? 'shrink' : ''
      }
    >
      <InnerContainer>
        {!hubState.hideLogo && (
          <LogoContainer>
            <Link to={'/'}>
              <img src={NavbarLogo} alt="explorer-logo" />
            </Link>
          </LogoContainer>
        )}

        <Navigation>
          <NavItem>
            <NavLink activeClassName="active" to={'/dashboard'}>
              <i className="fa fa-th"></i>
              <span>Dashboard</span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink activeClassName="active" to={'/transactions'}>
              <i className="fa fa-location-arrow"></i>
              <span>Latest Tx</span>
            </NavLink>
          </NavItem>
          {!hubState.hideLogo && (
            <NavItem>
              <NavLink activeClassName="active" to={'/search'}>
                <i className="fa fa-search"></i>
                <span>Search</span>
              </NavLink>
            </NavItem>
          )}

          <NavItem>
            <NavLink activeClassName="active" to={'/watchtower'}>
              <i className="fa fa-eye"></i>
              <span>Watch Tower</span>
            </NavLink>
          </NavItem>
        </Navigation>
      </InnerContainer>
    </Container>
  );
};

export default Navbar;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  background: #fff;
  transition: all 0.3s ease;
  &.shrink {
    width: calc(100% - 400px);
  }
`;

const InnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 20px;
  position: relative;
  @media (max-width: 460px) {
    flex-direction: column;
    justify-content: center;
    margin-bottom: 2rem;
    > div {
      margin: auto;
      &:first-child {
        margin-bottom: 1rem;
      }
    }
  }
`;

const LogoContainer = styled.div`
  img {
    width: 200px;
    @media (max-width: 991px) {
      width: 180px;
    }
  }
`;

const Navigation = styled.div`
  margin-left: auto;
  padding-top: 0.2rem;
`;

const NavItem = styled.div`
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
  @media (max-width: 500px) {
    margin-left: 10px;
  }
  a {
    display: block;
    border-radius: 25px;
    padding: 10px 30px;
    font-size: 14px;
    background: ${(props) => props.theme.data.lightBlueColor};
    color: ${(props) => props.theme.data.textColor};
    border: 1px solid ${(props) => props.theme.data.lightBlueColor};
    i {
      display: none;
    }
    &:hover {
      border: 1px solid ${(props) => props.theme.data.blueColor};
      color: ${(props) => props.theme.data.blueColor};
    }

    &.active {
      border: 1px solid ${(props) => props.theme.data.blueColor};
      color: ${(props) => props.theme.data.blueColor};
    }
  }

  &:first-child {
    margin-left: 0;
  }

  @media (max-width: 991px) {
    a {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      text-align: center;
      padding: 0;
      i {
        display: block;
        line-height: 40px;
      }
      span {
        display: none;
      }
    }
  }
`;
