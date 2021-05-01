import './App.css';
import React from 'react';
import axios from 'axios';
import Tabs from "./components/Tabs";
import Portfolio from './Portfolio';
import Transaction from './Transaction';
import LineChart from './LineChart'
import Clock from './Clock';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current_prices: this.props.current_prices,
      portfolio_id: this.props.portfolio_id,
      portfolio_values: this.props.portfolio, flip: false,
      username: this.props.username,
    };
    this.transaction_update = this.transaction_update.bind(this);
  }
  update = () => {
    axios.get("http://localhost:3000/currentprices/").then((response) => {
      console.log('Updating to latest price data');
      this.setState({ current_prices: response.data, portfolio_id: this.state.portfolio_id, flip:!this.state.flip });
    });
  }
  round = (number) => {
    return Math.round(number*100) / 100;
  }
  logout = () => {
    console.log('Logging Out');
    window.location.reload(false);
  }
  componentDidMount() {
    this.setState({ current_prices: this.props.current_prices, portfolio_id: this.props.portfolio_id, portfolio_values: this.props.portfolio, flip: false });
  }
  transaction_update(new_portfolio_values) {
    this.setState({ portfolio_values: new_portfolio_values});
    console.log('transaction update completed');
  }
  render() {
    let labels = this.state.current_prices.map((val) => val.time).reverse();
    let btc_data = this.state.current_prices.map((val) => val.btc_usd).map(val => this.round(val)).reverse();
    let eth_data = this.state.current_prices.map((val) => val.eth_usd).map(val => this.round(val)).reverse();
    let ltc_data = this.state.current_prices.map((val) => val.ltc_usd).map(val => this.round(val)).reverse();
    let values = this.state.portfolio_values;
    if (this.state.flip) {
      return (<div className='App'>
        <div className='top'>
          <h2>Mac's OG Crypto App!</h2>
          <h5>Logged in as: {this.state.username} <button type="button" onClick={this.logout}>Logout</button></h5>
          <Clock callback={this.update}/>
          <Tabs>
            <div label="Bitcoin">
              <LineChart name={"Bitcoin"} data={this.state.current_prices.map((val) => val.btc_usd).reverse()} labels={labels} />
            </div>
            <div label="Ethereum">
              <LineChart name={"Ethereum"} data={eth_data} labels={labels} />
            </div>
            <div label="Litecoin">
              <LineChart name={"Litecoin"} data={ltc_data} labels={labels} />
            </div>
          </Tabs>
        </div>
        <div className='bottom'>
          <Portfolio id={this.state.portfolio_id} values={this.state.portfolio_values} transaction_update={this.transaction_update} current_prices={this.state.current_prices[0]}/>
        </div>
      </div>);
    } else {
      return (<div className='App'>
        <div className='top'>
          <h2>Mac's OG Crypto App!</h2>
          <h5>Logged in as: {this.state.username} <button type="button" onClick={this.logout}>Logout</button> </h5>
          <Clock seconds={15} callback={this.update}/>
          <Tabs>
            <div label="Bitcoin">
              <LineChart name={"Bitcoin"} data={btc_data} labels={labels} />
            </div>
            <div label="Ethereum">
              <LineChart name={"Ethereum"} data={eth_data} labels={labels} />
            </div>
            <div label="Litecoin">
              <LineChart name={"Litecoin"} data={ltc_data} labels={labels} />
            </div>
          </Tabs>
        </div>
        <div className='bottom'>
          <Portfolio id={this.state.portfolio_id} values={this.state.portfolio_values} transaction_update={this.transaction_update} current_prices={this.state.current_prices[0]} />
        </div>
      </div>);
    }

  }
}
//<Transaction portfolio_id={this.state.portfolio_id} portfolio_values={values} update={this.transaction_update} />
export default App;
