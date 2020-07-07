import React from 'react';
import ReactDOM from 'react-dom';
import { StoreProvider } from 'easy-peasy';
import MainRoutes from './routes';
import store from './store';
import './index.css';
import ErrorBoundary from './ErrorBoundary';

const Index = () => {
  return (
    <StoreProvider store={store}>
      <ErrorBoundary>
        <MainRoutes />
      </ErrorBoundary>
    </StoreProvider>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));
