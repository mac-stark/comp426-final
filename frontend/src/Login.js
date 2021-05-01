import React from 'react';
import axios from 'axios';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state={login_callback:this.props.login_callback, error: undefined};
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;

        let go_url =`http://localhost:3000/login/${username}/${password}`;
        axios({
            method:'get',
            url: go_url,
        }).then((response) => {
            this.state.login_callback(response.data.response[0].portfolio_id, response.data.response[0], response.data.username);
        }).catch((error) => {
            console.log('Login Error: Unknown Username or Incorrect Password');
            this.setState({error: 'Unknown Username'})
        });
    }
    render() {
        
        return (<div><div className='login-container'>
            <div>Login Form</div>
            <label htmlFor='username'>Username</label>
            <input type='text' id='username' name='username'></input>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password'></input>
            <button type="button" onClick={this.onClick}>Login</button>
        </div><div>{this.state.error}</div></div>);
    }
}
export default Login;