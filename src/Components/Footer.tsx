import React from 'react';
import styled from 'styled-components';
import LiquidityLogo from '../assets/images/liquidity-logo.svg';

const Footer = () => {
  return (
    <Conatainer>
      <span>Powered by</span>
      <a
        href="https://liquidity.network/"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img src={LiquidityLogo} alt="" />
      </a>
    </Conatainer>
  );
};

export default Footer;

const Conatainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 2rem 0;

  span {
    display: inline-block;
    vertical-align: middle;
  }
  img {
    display: inline-block;
    vertical-align: middle;
    width: 140px;
  }
`;
