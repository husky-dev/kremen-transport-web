import './index.css';

import { NavPath } from '@core';
import { initSentry } from '@core/sentry';
import { MuiThemeProvider } from '@material-ui/core';
import MapScreen from '@screens/Map';
import { PrivacyScreen } from '@screens/Privacy';
import { muiTheme } from '@styles';
import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

initSentry();

const AppContainer: FC = () => (
  <MuiThemeProvider theme={muiTheme}>
    <Router>
      <Switch>
        <Route path={NavPath.Root} exact={true} component={MapScreen} />
        <Route path={NavPath.Privacy} exact={true} component={PrivacyScreen} />
        <Redirect to={NavPath.Root} />
      </Switch>
    </Router>
  </MuiThemeProvider>
);

ReactDOM.render(<AppContainer />, document.getElementById('app'));
