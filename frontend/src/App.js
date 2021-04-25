import './App.css';
import React from 'react';
import Display from './Display';
import axios from 'axios';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {current_prices: this.props.current_prices, portfolio_id: this.props.portfolio_id};

  }
  update = () => {
    axios.get("http://localhost:3000/currentprices/").then((response) => {
      console.log('Updating to latest price data');
      this.setState({current_prices: response.data});
    });
  }
  componentDidMount() {
    this.setState({current_prices: this.props.current_prices, portfolio_id: this.props.portfolio_id});
    setInterval(this.update, 60 * 1000);
  }

  render() {
    let prices = [];
    for (let i = 0; i< this.state.current_prices.length; i++) {
      prices.push(<Display key= {'id_' + this.state.current_prices[i].id} price={this.state.current_prices[i]} />);
    }
    return (<div className="App">
        {prices}</div>);
  }
}

export default App;
