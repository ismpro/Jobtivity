import React from 'react';
import "../styles/header.css";
import logo from '../images/logo.png'

export default function Header(props) {

    

    return (
        <div className='container'>
           <img src={logo} alt="Logo" />
        </div>
    )
}