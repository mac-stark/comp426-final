import React from 'react';
import Transaction from './Transaction';

class Portfolio extends React.Component {
    constructor(props){
        super(props);
        this.state = {id: this.props.id, values: this.props.values, transaction_update:this.props.transaction_update, current_prices:this.props.current_prices};
        this.update = this.update.bind(this);
    }
    componentDidMount() {
        this.setState({id: this.props.id, values: this.props.values, transaction_update:this.props.transaction_update, current_prices:this.props.current_prices});
    }
    round = (number) => {
        return Math.round(number*100) / 100;
    }
    update(new_portfolio_values){
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