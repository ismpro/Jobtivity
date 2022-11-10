import React from 'react';
import ReactDomClient from 'react-dom/client';
import App from './Components/App.jsx';

let title = "Jobify"

window.title = title;

//Using 
const root = ReactDomClient.createRoot(document.getElementById('app'));
root.render(<App />);

module.hot.accept();