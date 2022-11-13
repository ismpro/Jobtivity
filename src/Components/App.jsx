import React from 'react';
import Header from './Header.jsx';
import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import Index from './Index.jsx'
import Jobs from './Jobs/Jobs.jsx'
import Home from './Home/Home.jsx'
import Admin from './Admin/Admin.jsx'
import About from './About.jsx'

const App = () =>
  <BrowserRouter>
    <div>
      <Header isLogin={true} />
      <main>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>;

export default App;