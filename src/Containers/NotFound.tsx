import React from 'react';
import styled from 'styled-components';
const NotFound = () => {
  return (
    <Container>
      <h1>404 NOT FOUND!</h1>
    </Container>
  );
};

export default NotFound;

const Container = styled.div`
  padding-top: 100px;
  background: #fff;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
