import './App.css'
import facebookIcon from './assets/facebook.png'
import instagramIcon from './assets/instagram.png'
import twitterIcon from './assets/twitter.png'

function App() {
  return (
    <div className="app">
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
          </ul>
        </nav>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Delicious Food, Delivered Fast</h1>
            <p className="hero-subtitle">Experience the finest cuisine from our kitchen to your doorstep. Fresh ingredients, authentic flavors, and lightning-fast delivery.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Order Now</button>
              <button className="btn btn-secondary">View Menu</button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">15-30</span>
                <span className="stat-label">Min Delivery</span>
              </div>
              <div className="stat">
                <span className="stat-number">4.9</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Happy Customers</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="container">
            <h2 className="section-title">Why Choose TastyFood?</h2>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>Get your food delivered in 15-30 minutes with our efficient delivery network.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">🍴</div>
                <h3>Fresh Ingredients</h3>
                <p>We use only the freshest, highest quality ingredients in all our dishes.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">💳</div>
                <h3>Easy Payment</h3>
                <p>Secure and convenient payment options including cash, card, and digital wallets.</p>
              </div>
              <div className="feature">
                <div className="feature-icon">⭐</div>
                <h3>Quality Guarantee</h3>
                <p>100% satisfaction guarantee or your money back. We stand behind our food.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Ready to Order?</h2>
            <p>Join thousands of satisfied customers and experience the best food delivery service in town.</p>
            <button className="btn btn-primary btn-large">Start Ordering</button>
          </div>
        </section>
      </main>

      <footer className="footer">
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
                <li><a href="#about">About Us</a></li>
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
    </div>
  )
}

export default App
