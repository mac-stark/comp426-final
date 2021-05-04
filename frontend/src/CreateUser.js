import React from 'react';
import axios from 'axios';

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state={callback:this.props.new_user_callback, error: undefined};
        this.onClick = this.onClick.bind(this);
    }
    onClick() {
        let username = document.getElementById('new_username').value;
        let password = document.getElementById('new_password').value;

        let go_url = `http://localhost:5000/createuser/${username}/${password}`;
        console.log(go_url);
        axios({
            method: 'post',
            url: go_url,
        }).then((response) => {
            console.log(response);
            this.setState({error: 'Account Created'});
            setTimeout(() => {
                window.location.reload();
            }, 1*1000);
        }).catch((error) => {
            console.log(error);
            this.setState({error: 'Username already taken'})
        });

    }
    render() {
        return (<div><div className='login-container'>
            <div className='login-form-header'>Create new Account!</div>
            <div className='login-username'>
            <label htmlFor='new_username'>Username</label>
            <input type='text' id='new_username' name='new_username'></input>
            </div>
            <div className='login-password'><label htmlFor='new_password'>Password</label>
            <input type='password' id='new_password' name='new_password'></input>
            </div>
            <button type="button" onClick={this.onClick}>Create Account!</button>
        </div>
        <div>{this.state.error}</div></div>);
    }

}
export default CreateUser;