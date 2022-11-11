import React from 'react';
import "../styles/header.css";
import logo from '../images/logo.png'
import about from '../images/Icons/about.png'

let arrayIcons = [
    {
        name: "About",
        text: "About  Us",
        img: about
    },
    {
        name: "About",
        text: "gg",
        img: about
    }
]

export default function Header(props) {

    return (
        <div className='container'>
            <div className='logoContainer'>
                <img src={logo} alt="Logo" />
            </div>
            <div className='leftContainer'>
                <div className='icons'>
                    {arrayIcons.map((icon) =>
                        <div>
                            <img src={icon.img} alt={icon.name} />
                            <p>{icon.text}</p>
                        </div>)}
                </div>
                {props.isLogin ?
                    (<div>
                        <button>Sign Up</button>
                        <button style={{ backgroundColor: "#3366ff", color: "white" }}>Login</button>
                    </div>) : null}
            </div>
        </div>
    )
}