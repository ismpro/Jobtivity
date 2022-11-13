import React from 'react';
import check from '../../images/Icons/check.png'
import "../../styles/admin.css"

export default function PendingCompany(props) {

    return (
        <div className="pendingContainer">
            <div className="pendingCompany">
                <div className="pendingLogo"><img src={props.company.img} alt={props.company.title} /></div>
                <div className="pendingCompanyName"><h5>{props.company.name}</h5></div>
                <div className="pendingDescription">{props.company.description}</div>
                <div className="pendingLink"><a href={`http://${props.company.link}`}>{`http://${props.company.link}`}</a></div>
            </div>
            <div className="pendingButtons">
                <button><img src={check} alt="aproved" /></button>
                <button><img src={check} alt="disaproved" /></button>
            </div>
        </div >
    )
}