import React from 'react';
import axios from 'axios';
import Clock from './Clock';

let base_url = true ? "https://crypto-web-app-macstark.herokuapp.com/" : "http://localhost:3000/";


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
            url: base_url + 'transactions/whales/btc',
        }).then((response) => {
            console.log(response);
            if (response.data.length === 0) {
                console.log('New whale list blank for some reason-skipping udpate');
            } else {
                let mapped_data = response.data.map((element) => {return  {date_time: element.time, amount_btc:element.btc_amt, amount_usd:element.usd_amt}});
                console.log(mapped_data);
                this.setState({current_whales: mapped_data});
            }
        }).catch((error) => console.log(error));
    }
    render() {
        if (this.state.current_whales.length === 0) {
            return (<div><Clock on={false} seconds={60} callback={this.get_latest_whales}/>Loading Whale List</div>);
        } else {
            let whale_list = this.state.current_whales.map((element,index) => <div className='table-row-whale' key={index}><div className='table-data-whale'>{element.amount_btc}</div><div className='table-data-whale'>{Math.round(element.amount_usd/1000000) + ' M'}</div><div className='table-data-whale'>{element.date_time}</div></div>);
            return (<div className='whaleview'><div>Largest BTC transactions in last hour</div><div className='whale-table'><div className='table-row-whale' key='whale-header'><div className='table-data-whale' key='whale-btc-amt-header'>btc_amt</div><div className='table-data-whale'key='whale-usd-amt-header'>usd_amt</div><div className='table-data-whale' key='whale-time-amt-header'>time</div></div>{whale_list}</div>
            <div><Clock on = {false} seconds={60} callback={this.get_latest_whales}/></div></div>);
        }
    }
}

export default WhaleView;