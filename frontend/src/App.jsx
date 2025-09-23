import './App.css'
import Header from './components/common/header'
import Footer from './components/common/Footer'
import { Routes, Route } from 'react-router-dom'
import Menu from './pages/Menu.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { AuthProvider } from './utils/auth.jsx'

// Home page component
const Home = () => {
  return (
    <>
      <Header />
      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Delicious Food, Delivered Fast</h1>
            <p className="hero-subtitle">Experience the finest cuisine from our kitchen to your doorstep. Fresh ingredients, authentic flavors, and lightning-fast delivery.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary">View Menu</button>
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
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
