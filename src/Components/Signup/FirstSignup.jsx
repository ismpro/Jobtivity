import React from 'react';
import "../../styles/signup.css";
import logo from '../../images/logo.png'
import about from '../../images/Icons/about.png'

export default function FirstSignup(props) {
    return (
       <div>
            <h1>Get started</h1>
            <p>It only takes a few seconds..</p>
            <form className="signup_form" noValidate>
                <input type="email" placeholder='Email' name='email' required></input>
                <input type="password" placeholder='Password' name='password' required></input>
                <button onClick={() => props.onContinue()}>Continue</button>
                <a href='#'>Sign up as a company</a>
            </form>
        </div>
    )
}