import React from 'react';
import "../../styles/signup.css";
import logo from '../../images/logo.png'
import about from '../../images/Icons/about.png'

export default function SecondSignup(props) {
    return (
       <div>
            <h1>Get started</h1>
            <p>Almost there..</p>
            <form className="signup_form" noValidate>
                <input type="text" placeholder='First Name' name='name' required></input>
                <input type="text" placeholder='Last Name' name='lastname' required></input>
                <input type="date" placeholder='Birth Date' name='date' required></input>
                <select name="gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <input type="text" placeholder='Locality' name='local' required></input>
                <label><input type="checkbox"/>Show my profile to companies</label>
                <button onClick={() => props.onContinue()}>Continue</button>
            </form>
        </div>
    )
}