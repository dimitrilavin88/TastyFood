import React from 'react';

const Header = () => {
    return (
        <header className="header">
        <nav className="nav">
          <div className="logo">
            <span className="logo-text">TastyFood</span>
          </div>
          <ul className="nav-links">
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#order" className="order-btn">Order Now</a></li>
            <li><a href="#login" className="login-btn">Employee Login</a></li>
          </ul>
        </nav>
      </header>
    )
}

export default Header;