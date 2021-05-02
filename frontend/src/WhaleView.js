import React from 'react';
import axios from 'axios';
import Clock from './Clock';

class WhaleView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {current_whales: []};
        this.get_latest_whales = this.get_latest_whales.bind(this);
    }

    componentDidMount() {
        this.setState({current_whales: []});
        this.get_latest_whales();
    }

    get_latest_whales(){
        console.log('getting latest whales');
        axios({
            method: 'get',
            url: 'http://localhost:3000/transactions/whales/btc',
        }).then((response) => {
            let mapped_data = response.data.map((element) => {return {amount_btc: element.amount, amount_usd: element.amount_usd, from: element.from.address, to: element.to.address, hour: new Date(element.timestamp*1000).getHours(), minutes: JSON.stringify(new Date(element.timestamp*1000).getMinutes())}});
            console.log(mapped_data);
            this.setState({current_whales: mapped_data});
        }).catch((error) => console.log(error));
    }
    render() {
        if (this.state.current_whales.length === 0) {
            return (<div><Clock seconds={60} callback={this.get_latest_whales}/>Loading Whale List</div>);
        } else {
            let whale_list = this.state.current_whales.map((element) => <tr><td>{element.amount_btc}</td><td>{element.amount_usd}</td><td>{element.hour}:{element.minutes}</td></tr>);
            return (<div className='whaleview'><div>Largest BTC transactions today</div><table><tr><th>btc_amt</th><th>usd_amt</th><th>time</th></tr>{whale_list}</table><div><Clock seconds={60} callback={this.get_latest_whales}/></div></div>);
        }
        
    }
}

export default WhaleView;