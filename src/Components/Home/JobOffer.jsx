import React from 'react';
import "../../styles/home.css"
import check from '../../images/Icons/check.png'

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [day, month, year].join('/');
}

export default function JobOffer(props) {

    return (
        <div className="cardContainer">
            <div className="imgContainer">
                <img src={props.company.img} alt={props.company.title} />
            </div>
            <div className="title">
                <h3>{props.company.title}</h3>
            </div>
            <div className="type">{props.company.type}</div>
            <div className="description">{props.company.description}</div>
            <div className="duration">Duration: {props.company.duration}</div>
            <div className="money">{props.company.money} €</div>
            <div className="applyBtn">
                <button><span>Apply for job</span> <img src={check} alt="check" /></button>
            </div>
            <div className="available">Available until {formatDate(props.company.available)}</div>
        </div>
    )
}