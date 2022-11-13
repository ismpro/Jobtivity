import React from 'react';
import google from '../../images/google.png'
import deloitte from '../../images/deloitte.png'
import PendingCompany from "./PendingCompany.jsx"

let comp = [
    {
        key: "nicecompany",
        name: "Nice Company",
        description: "Its a nice company come and join us for a great sucesssscess",
        img: deloitte,
        link: "www.nicecompany.com"
    },
    {
        key: "another",
        name: "Another One",
        description: "Its a nice company come and join us for a great sucesssscess",
        img: google,
        link: "www.anotherone.com"
    }
]

export default function Admin(props) {
    return (
        <section style={{marginTop: 10}}> 
            <h5>Pending Approvals</h5>
            {comp.map(company => <PendingCompany key={company.key} company={company} />)}
        </section>
    )
} 