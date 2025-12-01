import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth.jsx';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const goToMenu = () => {
    navigate('/menu');
  }
  const goToHome = () => {
    navigate('/');
  }
  const goToLogin = () => {
    navigate('/login');
  }

  const goToChangePassword = () => {
    setIsMenuOpen(false);
    navigate('/change-password');
  }

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate('/');
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <div className="user-menu" ref={menuRef}>
                <button
                  className="user-menu-button"
                  onClick={toggleMenu}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                >
                  {user.first_name ? `Hi, ${user.first_name}` : 'Account'}
                  <span className={`user-menu-arrow ${isMenuOpen ? 'open' : ''}`}>▾</span>
                </button>
                <div className={`user-menu-dropdown ${isMenuOpen ? 'open' : ''}`}>
                  <button onClick={goToChangePassword}>Change Password</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
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