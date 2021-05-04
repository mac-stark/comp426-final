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
            url: 'http://localhost:5000/transactions/whales/btc',
        }).then((response) => {
            let mapped_data = response.data.map((element) => {return {amount_btc: Math.floor(element.amount), amount_usd: Math.floor(element.amount_usd/ 1000000) + 'M', from: element.from.address, to: element.to.address, hour: new Date(element.timestamp*1000).getHours(), minutes: JSON.stringify(new Date(element.timestamp*1000).getMinutes())}});
            console.log(mapped_data);
            this.setState({current_whales: mapped_data});
        }).catch((error) => console.log(error));
    }
    render() {
        if (this.state.current_whales.length === 0) {
            return (<div><Clock on={false} seconds={60} callback={this.get_latest_whales}/>Loading Whale List</div>);
        } else {
            let whale_list = this.state.current_whales.map((element,index) => <div className='table-row-whale' id={index}><div className='table-data-whale'>{element.amount_btc}</div><div className='table-data-whale'>{element.amount_usd}</div><div className='table-data-whale'>{element.hour}:{element.minutes}</div></div>);
            return (<div className='whaleview'><div>Largest BTC transactions in last hour</div><div className='whale-table'><div className='table-row-whale'><div className='table-data-whale'>btc_amt</div><div className='table-data-whale'>usd_amt</div><div className='table-data-whale'>time</div></div>{whale_list}</div>
            <div><Clock on = {false} seconds={60} callback={this.get_latest_whales}/></div></div>);
        }
        
    }
}

export default WhaleView;