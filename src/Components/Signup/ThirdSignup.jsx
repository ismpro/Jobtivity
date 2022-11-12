import React from 'react';
import "../../styles/signup.css";
import logo from '../../images/logo.png'
import about from '../../images/Icons/about.png'

export default function ThirdSignup(props) {
    return (
       <div>
            <h1>Get started</h1>
            <p>Last step</p>
            <form className="signup_form" noValidate>
                <textarea rows="10" cols="30" name="description" placeholder="Tell us something about you.."></textarea>
                <button onClick={() => props.onContinue()}>Continue</button>
            </form>
        </div>
    )
}