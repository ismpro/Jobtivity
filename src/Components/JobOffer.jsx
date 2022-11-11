import React from 'react';
import logo from '../images/logoImage.png'

export default function JobOffer(props) {

    const [hover, setHover] = React.useState(false);

    return (
        <div onClick={() => setHover(!hover)} style={{"backgroundColor": hover ? "black" : "green"}}>
           <h1>{props.title}</h1>
           <p>fix</p>
           <img src={logo} alt="" />
        </div>
    )
}