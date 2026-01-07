import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // 1. Get auth details
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('name'); // We can show the user's name too!

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    alert("Logged out successfully");
    navigate('/login');
  };

  return (
    // Added 'shadow-lg' for depth and 'py-3' for better spacing
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-lg py-3 sticky-top">
      <div className="container">
        
        {/* LOGO & BRAND NAME */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span style={{ fontSize: '1.8rem', marginRight: '10px' }}>⚽</span> 
          <span className="fw-bold text-uppercase" style={{ letterSpacing: '1px' }}>
            Turf Booking System
          </span>
        </Link>
        
        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            
            <li className="nav-item">
              <Link className="nav-link px-3" to="/">Home</Link>
            </li>

            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link px-3" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary ms-2 rounded-pill px-4" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                {/* Show User Name (Optional Touch) */}
                <li className="nav-item me-3 text-light opacity-75 d-none d-lg-block">
                    Hello, {userName}
                </li>

                {role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link text-warning fw-bold px-3" to="/admin">
                      ⚙️ Admin Panel
                    </Link>
                  </li>
                )}

                <li className="nav-item">
                  <Link className="nav-link px-3" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleLogout} 
                    className="btn btn-outline-light ms-2 rounded-pill px-4 btn-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;