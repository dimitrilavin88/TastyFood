import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useAuth } from '../../utils/auth.jsx';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const goToMenu = () => {
    navigate('/menu');
  }
  const goToHome = () => {
    navigate('/');
  }
  const goToLogin = () => {
    navigate('/login');
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
      <header className="header">
      <nav className="nav">
        <div className="logo">
          <span className="logo-text" onClick={goToHome}>TastyFood</span>
        </div>
        <ul className="nav-links">
          <li><a onClick={goToHome}>Home</a></li>
          <li><a onClick={goToMenu}>Menu</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact-info">Contact</a></li>
          <li>
            {user ? (
              <a className="login-btn" onClick={handleLogout}>Logout</a>
            ) : (
              <a href="#login" className="login-btn" onClick={goToLogin}>Employee Login</a>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;