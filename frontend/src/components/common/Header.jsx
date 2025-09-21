import React from 'react';
import {Link, useNavigate} from 'react-router-dom'


const Header = () => {

  const navigate = useNavigate();
  const goToMenu = () => {
    navigate('/menu');
  }

  return (
      <header className="header">
      <nav className="nav">
        <div className="logo">
          <span className="logo-text">TastyFood</span>
        </div>
        <ul className="nav-links">
          <li><a onClick={goToMenu}>Menu</a></li>
          <li><a href="#footer">About</a></li>
          <li><a href="#footer">Contact</a></li>
          <li><a href="#login" className="login-btn">Employee Login</a></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;