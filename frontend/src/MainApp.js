import React from 'react';
import Login from './Login';
import App from './App';
import axios from 'axios';
import CreateUser from './CreateUser';

let base_url = true ? "https://crypto-web-app-macstark.herokuapp.com/" : "http://localhost:3000/";

class MainApp extends React.Component {
    constructor(props){
        super(props);
        this.state={isLoggedIn: false, portfolio_id:0, portfolio_values:undefined, current_prices:undefined, username:undefined,loggin_in:true};
        this.create_new_user_button=this.create_new_user_button.bind(this);
        this.back_to_login = this.back_to_login.bind(this);
    }
    login = async (id, values, user) => {
        axios({
            method:'get',
            url: base_url + 'currentprices/',
        }).then((response) =>{
            this.setState({isLoggedIn:true, portfolio_id:id, portfolio_values:values, current_prices:response.data, username:user,loggin_in:true});
        })
    }

    create_new_user_button = function() {
        this.setState({loggin_in:false});
    }
    componentDidMount(){
        this.setState({isLoggedIn:false, portfolio_id:0, portfolio_values:undefined, current_prices:undefined, username:undefined,loggin_in:true});
    }
    back_to_login() {
        this.setState({loggin_in:true});
    }
    render() {
        if (this.state.isLoggedIn === false && this.state.loggin_in===true) {
            return (<div><div>
                <div className='login-header'>
                    <h3>COMP 426: Final Project</h3>
                    <h5>Mac Stark , UNC Spring 2021</h5>
                    <p>Welcome to my crypto web-app. This app pulls real time prices of bitcoin, ethereum 
                        and litecoin averaged across several exchanges. When you create an account you will be given 100,000 USD.
                        How much money can you make?
                    </p>
                </div>
                <div className='login-box'><Login login_callback={this.login}/>
                <div className='new-user-button'>Or: <button type='button' onClick={this.create_new_user_button}>Create Account</button></div>
                </div></div>
                </div>);

        } else if (this.state.isLoggedIn===false && this.state.loggin_in===false) {
            return (<div>
                <div className='login-box'>
                    <CreateUser new_user_callback={this.new_user}/>
                    </div>
                    <div className='new-user-button'>Or: <button type='button' onClick={this.back_to_login}>Back to Main Page</button>
                    </div></div>);
        } else {
            return (<App current_prices={this.state.current_prices} portfolio_id={this.state.portfolio_id} portfolio={this.state.portfolio_values} username={this.state.username}/>);
        }
    }
}
export default MainApp;