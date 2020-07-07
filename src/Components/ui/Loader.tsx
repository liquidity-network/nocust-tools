import React from 'react';
import styled from 'styled-components';
import Img from '../../assets/images/loader.gif';

interface Props {
  width?: string;
}
const Loader = (props: Props) => {
  return (
    <Container>
      <img src={Img} width={props.width ? props.width : '120px'} alt="" />
    </Container>
  );
};

export default Loader;

const Container = styled.div`
  padding: 1rem;
  text-align: center;
`;
