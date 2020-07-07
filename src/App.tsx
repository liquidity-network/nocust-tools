import React from 'react';
import styled from 'styled-components';
import { Switch, Route, Redirect } from 'react-router-dom';
import Search from './Containers/Search';
import Dashboard from './Containers/Dashboard';
import Transactions from './Containers/Transactions';
import SearchDetails from './Containers/SearchDetails';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import WalletPopup from './Components/WalletPopup';
import QRCodeScanner from './Components/QRCodeScanner';
import ChartPopup from './Components/ChartPopup';
import TxDetails from './Components/TxDetails';
import GlobalStyle from './GlobalStyle';
import { useStoreState } from './store';
import NotFound from './Containers/NotFound';
import WatchTowerMain from './Containers/WatchTowerMain';

const App: React.FC = () => {
  const { transferModel: trasnferState } = useStoreState((state) => state);
  return (
    <AppContainer>
      <GlobalStyle
        width={
          trasnferState.isSideOpen && window.innerWidth > 991
            ? 'calc(100% - 400px)'
            : '100%'
        }
      />
      <Navbar />
      <Switch>
        <Route component={WatchTowerMain} path="/watchtower" />
        <Route component={SearchDetails} path="/details/:hub/:query" />
        <Route component={Transactions} path="/transactions" />
        <Route component={Dashboard} path="/dashboard" />
        <Route component={Search} path="/search" />
        <Redirect from={'/'} to={'search'} />
        <Route path="*" exact={true} component={NotFound} />
      </Switch>
      <Footer />
      {trasnferState.isSideOpen && <TxDetails />}
      <WalletPopup />
      <QRCodeScanner />
      <ChartPopup />
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
  position: relative;
  background: #fff;
`;
