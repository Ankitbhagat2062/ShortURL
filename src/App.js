import React from 'react';
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar.js';
import Home from './Components/Home.js';
import Signin from './Components/Signin.js';
import Signup from './Components/Signup.js';
import { useDispatch } from 'react-redux';
import { setUser, login } from './features/User/UserSlice';
import VisitHistory from './Components/VisitHistory.js';
import AllURL from './Components/AllURL.js';

const App = () => {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    if (userId) {
      dispatch(setUser({ userId, email }));
      dispatch(login());
    }
  }, [dispatch]);
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AllURL" element={<AllURL />} />
        <Route path="/VisitHistory" element={<VisitHistory />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  )
}

export default App;
