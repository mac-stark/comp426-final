import React from 'react';

class Display extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price_val: this.props.price,
            portfolio_id: 1,
        }
    }
    componentDidMount() {
        this.setState({price_val: this.props.val});
    }
    render(){
        return (<div className='container'>
            <div className='element'>Time : ${this.state.price_val.date_time}</div>
            <div className='element'> BTC_USD : ${this.state.price_val.btc_usd}</div>
            <div className='element'> ETH_USD : ${this.state.price_val.eth_usd}</div>
            <div className='element'> LTC_USD : ${this.state.price_val.ltc_usd}</div>
        </div>);
    }
}
export default Display;