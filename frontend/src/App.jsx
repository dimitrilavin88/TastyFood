import './App.css'
import Header from './components/common/header'
import Footer from './components/common/Footer'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Menu from './pages/Menu.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ManageStaff from './pages/ManageStaff.jsx'
import ManageDrivers from './pages/ManageDrivers.jsx'
import { AuthProvider } from './utils/auth.jsx'
import ProtectedRoutes from './utils/ProtectedRoutes.jsx'
import ChangePassword from './pages/ChangePassword.jsx'
import RetrieveOrder from './pages/RetrieveOrder.jsx'
import RecordDelivery from './pages/RecordDelivery.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import DeliveryInfo from './pages/DeliveryInfo.jsx'
import CompletedOrder from './pages/CompletedOrder.jsx'
// Home page component
const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <main className="main">
        <section className="hero">
          <div className="hero-content">
            <h1 className="hero-title">Delicious Food, Delivered Fast</h1>
            <p className="hero-subtitle">Experience the finest cuisine from our kitchen to your doorstep. Fresh ingredients, authentic flavors, and lightning-fast delivery.</p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/menu')}>View Menu</button>
            </div>
            <div className="menu-preview">
              <h3>Featured Menu Items</h3>
              <div className="menu-preview-grid">
                <div className="menu-preview-category">
                  <h4>Appetizers</h4>
                  <div className="preview-items">
                    <div className="preview-item">
                      <img src="https://static01.nyt.com/images/2024/02/08/multimedia/ND-mozzarella-sticks-pvfm/ND-mozzarella-sticks-pvfm-mediumSquareAt3X.jpg" alt="Mozzarella Sticks" />
                      <span>Mozzarella Sticks</span>
                    </div>
                    <div className="preview-item">
                      <img src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&auto=format" alt="Chicken Wings" />
                      <span>Chicken Wings</span>
                    </div>
                  </div>
                </div>
                <div className="menu-preview-category">
                  <h4>Main Courses</h4>
                  <div className="preview-items">
                    <div className="preview-item">
                      <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop" alt="Grilled Salmon" />
                      <span>Grilled Salmon</span>
                    </div>
                    <div className="preview-item">
                      <img src="https://tastesbetterfromscratch.com/wp-content/uploads/2023/03/Chicken-Parmesan-1.jpg" alt="Chicken Parmesan" />
                      <span>Chicken Parmesan</span>
                    </div>
                  </div>
                </div>
                <div className="menu-preview-category">
                  <h4>Desserts</h4>
                  <div className="preview-items">
                    <div className="preview-item">
                      <img src="https://therecipecritic.com/wp-content/uploads/2021/04/newyorkcheesecake.jpg" alt="Cheesecake" />
                      <span>Cheesecake</span>
                    </div>
                    <div className="preview-item">
                      <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop" alt="Chocolate Lava Cake" />
                      <span>Chocolate Lava Cake</span>
                    </div>
                  </div>
                </div>
                <div className="menu-preview-category">
                  <h4>Beverages</h4>
                  <div className="preview-items">
                    <div className="preview-item">
                      <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop" alt="Coffee" />
                      <span>Coffee</span>
                    </div>
                    <div className="preview-item">
                      <img src="https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop" alt="Soda" />
                      <span>Soda</span>
                    </div>
                  </div>
                </div>
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
            <button className="btn btn-primary btn-large" onClick={() => navigate('/menu')}>Start Ordering</button>
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
          <Route path="/dashboard" element={
            <ProtectedRoutes><Dashboard /></ProtectedRoutes>
          } />
          <Route path="/manage-staff" 
          element={
            <ProtectedRoutes><ManageStaff /></ProtectedRoutes>
          } />
          <Route path="/manage-drivers" 
          element={
            <ProtectedRoutes><ManageDrivers /></ProtectedRoutes>
          } />
          <Route path="/change-password" 
          element={
            <ProtectedRoutes><ChangePassword /></ProtectedRoutes>
          } />
          <Route path="/retrieve-order" 
          element={
            <ProtectedRoutes><RetrieveOrder /></ProtectedRoutes>
          } />
          <Route path="/record-delivery" 
          element={
            <ProtectedRoutes><RecordDelivery /></ProtectedRoutes>
          } />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/delivery-info" element={<DeliveryInfo />} />
          <Route path="/completed-order" element={<CompletedOrder />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
