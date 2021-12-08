import './index.css';

import { config, NavPath } from '@core';
import { MuiThemeProvider } from '@material-ui/core';
import MapScreen from '@screens/Map';
import { PrivacyScreen } from '@screens/Privacy';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { muiTheme } from '@styles';
import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

Sentry.init({
  dsn: config.sentry.dsn,
  environment: config.env,
  release: `${config.name.replace('@kremen/', 'kremen-')}@${config.version}`,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

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
