import React from 'react';
import { Link } from "react-router-dom";
import "../styles/header.css";
import logo from '../images/logo.png'
import about from '../images/Icons/iconAbout.png'

let arrayIcons = [
    {
        name: "home",
        text: "Home",
        img: about,
        link: '/home',
        login: true
    },
    {
        name: "people",
        text: "People",
        img: about,
        link: '/people',
        login: true
    },
    {
        name: "jobs",
        text: "Jobs",
        img: about,
        link: '/jobs',
        login: true
    },
    {
        name: "about",
        text: "About  Us",
        img: about,
        link: '/about',
        login: false
    },
    {
        name: "profile",
        text: "Profile",
        img: about,
        link: '/profile',
        login: true
    }
]

export default function Header(props) {

    return (
        <header className='container'>
            <div className='logoContainer'>
                <Link to="/">
                    <img src={logo} alt="Logo" />
                </Link>
            </div>
            <div className='leftContainer'>
                <div className='icons'>
                    {arrayIcons.filter(icons => icons.login === props.isLogin || icons.login === false).map((icon) =>
                        <div key={icon.name}>
                            <Link to={icon.link}>
                                <img src={icon.img} alt={icon.name} />
                                <p>{icon.text}</p>
                            </Link>
                        </div>)}
                </div>
                {props.isLogin === false ?
                    (<div>
                        <button>Sign Up</button>
                        <button style={{ backgroundColor: "#3366ff", color: "white" }}>Login</button>
                    </div>) : null}
            </div>
        </header>
    )
}