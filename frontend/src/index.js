import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';

axios.get("http://localhost:3000/currentprices/").then((response) => {
  ReactDOM.render(
    <React.StrictMode>
      <App current_prices={response.data} portfolio_id={1}/>
    </React.StrictMode>,
    document.getElementById('root')
  );
});

