import React from 'react';
import Header from './Header.jsx';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import Index from './Index.jsx'
import Jobs from './Jobs/Jobs.jsx'
import Home from './Home/Home.jsx'

const App = () =>
  <BrowserRouter>
    <div>
      <Header isLogin={true} />
      <div>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </div>
    </div>
  </BrowserRouter>;

export default App;