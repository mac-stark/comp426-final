import './App.css';
import React from 'react';
import Tabs from "./components/Tabs";
import Portfolio from './Portfolio';
import LineChart from './LineChart'


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
    this.time_update = this.time_update.bind(this);
  }
  round = (number) => {
    return Math.round(number*100) / 100;
  }
  logout = () => {
    console.log('Logging Out');
    window.location.reload(false);
  }
  time_update(current_prices) {
    console.log('Updating to latest price data');
    this.setState({current_prices: current_prices, flip: !this.state.flip});
  }
  componentDidMount() {
    this.setState({ current_prices: this.props.current_prices, portfolio_id: this.props.portfolio_id, portfolio_values: this.props.portfolio, flip: false });
  }
  transaction_update(new_portfolio_values) {
    this.setState({ portfolio_values: new_portfolio_values});
    console.log('transaction update completed');
  }

  get_html(labels, btc_data, eth_data, ltc_data, values) {
    return (<div className='App'>
        <div className='top'>
          <div className='top-container'>
            <div className='title-container'>Mac's OG Crypto App</div>
            <div className='logged-in-as'>Logged in as: {this.state.username} <button type="button" onClick={this.logout}>Logout</button></div>
            <div className='tabs-div'>
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
         </div>
        </div>
        <div className='bottom'>
          <div className='bottom-container'>
            <Portfolio id={this.state.portfolio_id} values={this.state.portfolio_values} transaction_update={this.transaction_update} current_prices={this.state.current_prices[0]} time_update={this.time_update}/>
          </div>
        </div>
      </div>);
  }
  render() {
    let labels = this.state.current_prices.map((val) => val.time).reverse();
    let btc_data = this.state.current_prices.map((val) => val.btc_usd).map(val => this.round(val)).reverse();
    let eth_data = this.state.current_prices.map((val) => val.eth_usd).map(val => this.round(val)).reverse();
    let ltc_data = this.state.current_prices.map((val) => val.ltc_usd).map(val => this.round(val)).reverse();
    let values = this.state.portfolio_values;
    if (this.state.flip) {
      return this.get_html(labels, btc_data, eth_data, ltc_data, values);
    } else {
      return this.get_html(labels, btc_data, eth_data, ltc_data, values);
    }
  }
}
//<Transaction portfolio_id={this.state.portfolio_id} portfolio_values={values} update={this.transaction_update} />
export default App;
