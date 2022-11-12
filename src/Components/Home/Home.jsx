import React from 'react';
import "../../styles/home.css";
import jobs from "../../images/imageJobs.png"

export default function Home(props) {
    return (
        <div className='home'>
            <div>
                <h2>Number 1 connecting companies with workers</h2>
                <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</h5>
            </div>
            <img src={jobs} alt="Jobs" />
        </div>
    )
}