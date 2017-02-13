import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {indigo500, indigo700, grey400} from 'material-ui/styles/colors';
import Login from './components/Forms';
// import runtime from 'serviceworker-webpack-plugin/lib/runtime';

import * as firebase from 'firebase';
import configuration from './config/config';

import './sass/main.sass';

const injectTapEventPlugin = require('react-tap-event-plugin');
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: indigo500,
    primary2Color: indigo700,
    primary3Color: grey400
  }
});

firebase.initializeApp(configuration);

// if ('serviceWorker' in navigator) {
//   const registration = runtime.register();
//   console.log('Service Worker Registered');
// }

const App = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <div>
      <Login />
    </div>
  </MuiThemeProvider>
);

ReactDOM.render(<App />, document.getElementById('container'));
