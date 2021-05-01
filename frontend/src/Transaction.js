import axios from 'axios';
import React from 'react';

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
        let go_url = `http://localhost:3000/transaction/${this.state.portfolio_id}/${t_o.ticker}/${t_o.amt}/${t_o.is_buy}`;
        await axios({
            method:'post',
            url: go_url,
        }).then((response) => {
            console.log(response);
            this.state.callback(response.data[0])
        }).catch((error) => {
            console.log(error);
            console.log('Transaction Error: Illegal Transaction');
        });
        return;
    }

    render() {
        return (<div className='transaction'>
            <h1>Make a new transaction!</h1>
            <form id="form_1">
                <label htmlFor='transaction_type'>Buy or Sell</label><br></br>
                <select name='transaction_type' id='type_1'>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select><br></br>
                <label htmlFor='coin_type'>Select Coin</label><br></br>
                <select name='coin_type' id='coin_type_1'>
                    <option value="btc">Bitcoin</option>
                    <option value="eth">Ethereum</option>
                    <option value="ltc">Litecoin</option>
                </select>
                <br></br>
                <label htmlFor='amount'>Enter the Transaction Amount</label>
                <input type='number' id='amount_1'></input>
                <br></br>
                <input type = "submit" value ="Submit Transaction" onClick={this.onClick.bind(this)}></input>
            </form>
        </div>);
    }
}
export default Transaction;