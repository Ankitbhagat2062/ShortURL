import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch, } from 'react-redux';
import { logout, clearUser } from '../features/User/UserSlice';
import './Navbar.css'
const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.user.islogedin)
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    dispatch(logout())
    dispatch(clearUser())
  };

  return (
    <nav style={{
      backgroundColor: '#333',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
    }}>
      <div style={{ display: 'flex',alignItems:'center',justifyContent:'space-between', gap: '80px' }}>
        <Link to="/" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}>
          ShortURL
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {!isLoggedIn ? (
          <>
            <Link to="/signup" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', backgroundColor: '#007bff', borderRadius: '4px', transition: 'background-color 0.3s' }}>
              Signup
            </Link>
            <Link to="/signin" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem 1rem', backgroundColor: '#28a745', borderRadius: '4px', transition: 'background-color 0.3s' }}>
              Signin
            </Link>
          </>
        ) : (
          <>
            <div className="drop-down">
              <div className="nav-header">
                <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu" >
                  <div className="line"></div>
                  <div className="line"></div>
                  <div className="line"></div>
                </button>
              </div>
              <nav className={`nav-links ${open ? 'open' : ''}`}>
                <Link to="/AllURL" onClick={() => setOpen(false)}>All URL's</Link>
                <Link to="/VisitHistory" onClick={() => setOpen(false)}>Visit History's</Link>
                <button onClick={handleLogout} className="logout-btn" style={{ color: 'white', backgroundColor: '#dc3545', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s' }}>
                  <Link to="/" onClick={() => setOpen(false)}>Logout</Link>
                </button>
              </nav>
            </div>
          </>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
