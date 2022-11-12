import React from 'react';
import JobOffer from './JobOffer';
import google from '../../images/google.png'
import deloitte from '../../images/deloitte.png'

let comp = [
    {
        key: "nicecompany",
        title: "Nice Company",
        description: "Its a nice company come and join us for a great sucesssscess",
        img: deloitte,
        type: "Programming",
        duration: "No term",
        money: 1250,
        available: new Date(2022, 11, 25, 0, 0, 0)
    },
    {
        key: "another",
        title: "Another One",
        description: "Its a nice company come and join us for a great sucesssscess",
        img: google,
        type: "Human Resources",
        duration: "12 months",
        money: 950,
        available: new Date(2022, 11, 28, 0, 0, 0)
    }
]

export default function Home(props) {
    return (
        <div style={{marginTop: 10}}> 
            {comp.map(company => <JobOffer key={company.key} company={company} />)}
        </div>
    )
}