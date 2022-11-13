import React from 'react';
import "../styles/header.css";
import russo_ismael from "../images/russo_ismael.png"

export default function Header(props) {

    return (
        <div>
            <h3>About Us</h3>
            <img style={{ height: 300,textAlign: "center" }} src={russo_ismael} alt="russo_ismael" />
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
    )
}