import React from 'react';
import Login from './Login';
import App from './App';
import axios from 'axios';
import CreateUser from './CreateUser';

class MainApp extends React.Component {
    constructor(props){
        super(props);
        this.state={isLoggedIn: false, portfolio_id:0, portfolio_values:undefined, current_prices:undefined, username:undefined};
    }
    login = async (id, values, user) => {
        axios({
            method:'get',
            url: 'http://localhost:3000/currentprices/',
        }).then((response) =>{
            this.setState({isLoggedIn:true, portfolio_id:id, portfolio_values:values, current_prices:response.data, username:user});
        })
    }
    componentDidMount(){
        this.setState({isLoggedIn:false, portfolio_id:0, portfolio_values:undefined, current_prices:undefined, username:undefined});
    }

    render() {
        if (this.state.isLoggedIn === false) {
            return (<div><div>
                <div className='login-header'>
                    <h3>Mac's Cryptocurrency Web-App.</h3>
                    <p>Welcome to my crypto web-app. This app pulls real time prices of bitcoin, ethereum 
                        and litecoin averaged across several exchanges. When you create an account you will be given 100,000 USD.
                        How much money can you make?
                    </p>
                </div>
                <Login login_callback={this.login}/></div>
                <div><CreateUser new_user_callback={this.new_user}/></div></div>);

        } else {
            return (<App current_prices={this.state.current_prices} portfolio_id={this.state.portfolio_id} portfolio={this.state.portfolio_values} username={this.state.username}/>);
        }
    }
}
export default MainApp;