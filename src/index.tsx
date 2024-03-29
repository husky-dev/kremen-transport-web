import './index.css';

import { routes, StorageProvider } from '@core';
import { initSentry } from '@core/sentry';
import { MuiThemeProvider } from '@material-ui/core';
import MapScreen from '@screens/Map';
import { PrivacyScreen } from '@screens/Privacy';
import AboutScreen from '@screens/About';
import { muiTheme } from '@styles';
import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

initSentry();

const AppContainer: FC = () => (
  <StorageProvider>
    <MuiThemeProvider theme={muiTheme}>
      <Router>
        <Routes>
          <Route path={routes.index} element={<MapScreen />} />
          <Route path={routes.privacy} element={<PrivacyScreen />} />
          <Route path={routes.about} element={<AboutScreen />} />
          <Route path="*" element={<Navigate to={routes.index} />} />
        </Routes>
      </Router>
    </MuiThemeProvider>
  </StorageProvider>
);

ReactDOM.render(<AppContainer />, document.getElementById('app'));
