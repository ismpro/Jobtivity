import React, { useContext, useEffect } from 'react';
import "../../styles/signup.css";
import FirstSignup from './FirstSignup.jsx'
import SecondSignup from './SecondSignup.jsx'
import ThirdSignup from './ThirdSignup.jsx'
import { SignedContext } from '../App';
import logo from '../../images/logo.png'
import about from '../../images/Icons/about.png'

export default function Signup(props) {

    const [step, setStep] = React.useState(0);
    const addStep = ()  => {
        setStep(step + 1);
    }

    const components = [<FirstSignup onContinue={addStep}/>, <SecondSignup onContinue={addStep}/>, <ThirdSignup onContinue={addStep}/>];
   
    return (
        <div className='main'>
            <div className="signup_container">
                {
                    components[step]
                }
            </div>
        </div>
    )
}