import './App.css';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Import Router components
import React, { useState, useEffect } from 'react';
import Movies from './compoonents/Movies';
import Login from './compoonents/Login';
import SignUp from './compoonents/SignUp';
import MovieDetails from './compoonents/MovieDetails';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
const [userName,setUserName] = useState("")
  useEffect(() => {
    const userIdFromAuth = getAuth();
    setUserId(userIdFromAuth);
    setIsLoggedIn(!!userIdFromAuth);
  }, []);

  const getAuth = () => {
    const userId = sessionStorage.getItem('userId');
    return userId;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
  };

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
                <Link to="/signup" className="text-white">
                  Sign Up
                </Link>
              )}
              {!isLoggedIn ? (
                <Link to="/login" className="text-white">
                  Login
                </Link>
              ) : (
                <Link to="/login" className="text-white" onClick={handleLogout}> {/* Use Link for Logout */}
                  Logout
                </Link>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Movies userId={userId} isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path='/movies/:movieId' element={<MovieDetails/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
