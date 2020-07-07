import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Light from './services/themes/light';
import App from './App';

const routes: React.FC = () => {
  return (
    <ThemeProvider theme={Light}>
      <Router>
        <Route component={App} path="/" />
      </Router>
    </ThemeProvider>
  );
};

export default routes;
