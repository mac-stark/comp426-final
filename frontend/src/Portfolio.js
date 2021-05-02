import React from 'react';
import Transaction from './Transaction';
import axios from 'axios';
import Clock from './Clock';
import WhaleView from './WhaleView';

class Portfolio extends React.Component {
    constructor(props){
        super(props);
        this.state = {id: this.props.id, values: this.props.values, transaction_update:this.props.transaction_update, current_prices:this.props.current_prices, callback_time_update:this.props.time_update};
        this.update = this.update.bind(this);
    }
    componentDidMount() {
        this.setState({id: this.props.id, values: this.props.values, transaction_update:this.props.transaction_update, current_prices:this.props.current_prices, callback_time_update:this.props.time_update});
    }
    round = (number) => {
        return Math.round(number*100) / 100;
    }
    time_update = () => {
        axios.get("http://localhost:3000/currentprices/").then((response) => {
        console.log('Updating to latest price data');
        this.setState({ current_prices: response.data[0], portfolio_id: this.state.portfolio_id });
        this.state.callback_time_update(response.data);
        console.log(this.state);
        console.log(this.state.current_prices);
    });
    }
    update(new_portfolio_values){
        console.log('transaction request completed');
        this.setState({values:new_portfolio_values});
        this.state.transaction_update(new_portfolio_values);
    }
    render() {
        let btc = parseFloat(this.state.values.btc_amt);
        let eth = parseFloat(this.state.values.eth_amt);
        let ltc = parseFloat(this.state.values.ltc_amt);
        let usd = parseFloat(this.state.values.usd_amt);
        let current_value = btc * parseFloat(this.state.current_prices['btc_usd']) + eth * parseFloat(this.state.current_prices['eth_usd']) + ltc * parseFloat(this.state.current_prices['ltc_usd']) + usd;
        return (
            <div>
                <WhaleView/>
                <Clock seconds={15} callback={this.time_update}/>
                <div className='portfolio'>
                <h3>Current Value: <br></br> {this.round(current_value)} $ USD</h3>
                <h4>Balances</h4>
                <ul>
                    <li>BTC : {btc}</li>
                    <li>ETH : {eth}</li>
                    <li>LTC : {ltc}</li>
                    <li>USD : {usd}</li>
                </ul>
                </div>
                <div>
                    <Transaction portfolio_id={this.state.id} portfolio_values={this.state.values} update={this.update}/>
                </div>
            </div>);
    }
}
export default Portfolio;