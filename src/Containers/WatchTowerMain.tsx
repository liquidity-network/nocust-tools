import React from 'react';
import { Switch, Route } from 'react-router-dom';
import StateUpdateChallenge from './StateUpdateChallenge';
import WatchTower from './WatchTower';
import styled from 'styled-components';
import WithdrawFunds from './WithdrawFunds';
import RecoveryTool from './RecoveryTool';

const WatchTowerMain = () => {
  return (
    <Container>
      <Switch>
        <Route component={RecoveryTool} path="/watchtower/recovery" />
        <Route component={WithdrawFunds} path="/watchtower/withdraw" />
        <Route component={StateUpdateChallenge} path="/watchtower/challenge" />
        <Route component={WatchTower} path="/watchtower" />
      </Switch>
    </Container>
  );
};

export default WatchTowerMain;

const Container = styled.div``;
