import React from 'react';
import facebookIcon from '../../assets/facebook.png'
import instagramIcon from '../../assets/instagram.png'
import twitterIcon from '../../assets/twitter.png'

const Footer = () => {
    return (
        <footer id="footer" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo">
                <span className="logo-text">TastyFood</span>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#menu">Menu</a></li>
                <li><a id="about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📧 tastyfood@gmail.com</p>
              <p>📞 (555) 123-4567</p>
              <p>📍 123 Food Street, City, State 12345</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">
                  <img src={facebookIcon} alt="Facebook" className="social-icon" />
                </a>
                <a href="#" aria-label="Instagram">
                  <img src={instagramIcon} alt="Instagram" className="social-icon" />
                </a>
                <a href="#" aria-label="Twitter">
                  <img src={twitterIcon} alt="Twitter" className="social-icon" />
                </a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Hours</h4>
              <p>Monday - Friday: 11:00 AM - 10:00 PM</p>
              <p>Saturday - Sunday: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 TastyFood. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
}

export default Footer;