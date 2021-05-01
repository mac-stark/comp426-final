import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';
import Login from './Login';
import MainApp from './MainApp';

ReactDOM.render(
  <React.StrictMode>
    <MainApp/>
  </React.StrictMode>,
  document.getElementById('root')
);

// axios.get("http://localhost:3000/currentprices/").then((response) => {
//   axios.get("http://localhost:3000/portfolio/1").then((val) => {
//     ReactDOM.render(
//       <React.StrictMode>
//         <Login/>
//       </React.StrictMode>,
//       document.getElementById('root')
//     )
//   })
// });

//<App current_prices={response.data} portfolio_id={1} portfolio={val.data[0]}/>
