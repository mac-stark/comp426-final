import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import MainApp from './MainApp';

window.is_deploy = true;

ReactDOM.render(
  <React.StrictMode>
    <MainApp/>
  </React.StrictMode>,
  document.getElementById('root')
);
