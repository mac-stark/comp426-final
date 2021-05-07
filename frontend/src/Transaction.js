import axios from 'axios';
import React from 'react';

let base_url = true ? "https://crypto-web-app-macstark.herokuapp.com/" : "http://localhost:3000/";

class Transaction extends React.Component {
    constructor(props){
        super(props);
        this.state = {portfolio_id: this.props.portfolio_id, portfolio_values: this.props.portfolio_values, t_o:{}, callback:this.props.update};
    }
    componentDidMount() {
        this.setState({portfolio_id: this.props.portfolio_id, portfolio_values: this.props.portfolio_values, t_o:{}, callback:this.props.update});
    }
    
    async onClick(event) {
        event.preventDefault();
        let t_o = {
            ticker: document.getElementById("coin_type_1").value.toUpperCase(),
            amt: document.getElementById("amount_1").value,
            is_buy: document.getElementById("type_1").value === 'buy' ? true:false,
        }
        let go_url = base_url+`transaction/${this.state.portfolio_id}/${t_o.ticker}/${t_o.amt}/${t_o.is_buy}`;
        await axios({
            method:'post',
            url: go_url,
        }).then((response) => {
            console.log(response);
            this.state.callback(response.data[0]);
            console.log('calling portfolio callback');
        }).catch((error) => {
            console.log(error);
            alert('Transaction Error: Insufficient Funds');
            console.log('Transaction Error: Illegal Transaction');
        });
        return;
    }

    render() {
        return (<div><div className='transaction-header'>Make a new transaction</div>
        <div className='transaction'>
            <form id="form_1">
            <div className='transaction-type'><label htmlFor='transaction_type'>Buy or Sell</label>
                <select name='transaction_type' id='type_1'>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select></div>
            <div className='transaction-coin'>
            <label htmlFor='coin_type'>Select Coin            </label>
                <select name='coin_type' id='coin_type_1'>
                    <option value="btc">Bitcoin</option>
                    <option value="eth">Ethereum</option>
                    <option value="ltc">Litecoin</option>
                </select>
            </div> 
            <div className='transaction-amount'>
            <label htmlFor='amount'>Enter the Transaction Amount               </label>
                <input type='number' id='amount_1'></input>
            </div>
            <div className='transaction-submit-button'> <input type = "submit" value ="Submit Transaction" onClick={this.onClick.bind(this)}></input></div>   
            </form>
        </div></div>);
    }
}
export default Transaction;