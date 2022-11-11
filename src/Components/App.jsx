import React from 'react';
import Header from './Header.jsx';
import { BrowserRouter as Router } from "react-router-dom";
import {
  Switch,
  Route
} from "react-router";
import Home from './Home/Home.jsx'

const App = () =>
  <div>
    <Header isLogin />
    <Router>
      <Switch>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  </div>;

export default App;