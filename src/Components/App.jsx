import React from 'react';
import Header from './Header.jsx';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import Home from './Home/Home.jsx'
import Jobs from './Jobs/Jobs.jsx'

const App = () =>
  <BrowserRouter>
    <div>
      <Header isLogin={false} />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>;

export default App;