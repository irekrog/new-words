import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/Login';

import './sass/main.sass';

const App = () => {
  return (
    <Login />
  );
};

ReactDOM.render(<App />, document.getElementById('container'));
