import React from 'react';
import Header from './Header.jsx';
import JobOffer from './JobOffer.jsx';

let arr = [{title: "merda"}, {title: "gg"}]

const App = () =>
  <div>
    <Header />
    <p>React with hot reload</p>
    {arr.map(tt => <JobOffer title={tt.title} />)}
  </div>;

export default App;