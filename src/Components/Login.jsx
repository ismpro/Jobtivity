import React from 'react';
import "../styles/login.css";
import logo from '../images/logo.png'
import about from '../images/Icons/about.png'

export default function Login(props) {

    return (
        <div className='main'>
            <div className="login_container">
                <h1>Login</h1>
                <p>New here? <a href="#">Sign up</a></p>
                <form className='login_form'>
                    <input type="text" placeholder='Enter username' name='name' required></input>
                    <input type="password" placeholder='Enter password' name='password' required></input>
                    <button type="submit">Login</button>
                    <a href='#'>Forgot password?</a>
                </form>
            </div>
        </div>
    )
}