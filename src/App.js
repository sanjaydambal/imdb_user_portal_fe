import './App.css';

import Movies from './compoonents/Movies';
import Login from './compoonents/Login';
import SignUp from './compoonents/SignUp';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <div className="App">
      <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-white text-xl">
              <Link to="/">Movies</Link>
            </div>
            <div className="flex space-x-4">
              {!isLoggedIn && (
                <Link to="/signup" className="text-white">Sign Up</Link>
              )}
              {!isLoggedIn && (
                <Link to="/login" className="text-white">Login</Link>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path='/' element={<Movies />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
        </Routes>
        <Movies />
      </div>
    </Router>
  );
}

export default App;
