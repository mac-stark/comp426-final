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

        let go_url = `http://localhost:3000/createuser/${username}/${password}`;
        console.log(go_url);
        axios({
            method: 'post',
            url: go_url,
        }).then((response) => {
            console.log(response);
            this.setState({error: 'Account Created'});
        });
    }
    render() {
        return (<div><div className='new-user-container'>
            <div>Create new Account!</div>
            <label htmlFor='new_username'>Username</label>
            <input type='text' id='new_username' name='new_username'></input>
            <label htmlFor='new_password'>Password</label>
            <input type='password' id='new_password' name='new_password'></input>
            <button type="button" onClick={this.onClick}>Create Account!</button>
        </div><div>{this.state.error}</div></div>);
    }

}
export default CreateUser;