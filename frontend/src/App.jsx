import './App.css'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
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
import { API_BASE_URL } from './config/api.js';

// Home page component
const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, itemsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/menu/categories`),
        fetch(`${API_BASE_URL}/menu/items`)
      ]);

      if (!categoriesResponse.ok || !itemsResponse.ok) {
        throw new Error('Failed to fetch menu data');
      }

      const categoriesData = await categoriesResponse.json();
      const itemsData = await itemsResponse.json();

      // Sort categories by displayOrder if available, otherwise by name
      const sortedCategories = categoriesData.sort((a, b) => {
        if (a.displayOrder !== null && b.displayOrder !== null) {
          return a.displayOrder - b.displayOrder;
        }
        if (a.displayOrder !== null) return -1;
        if (b.displayOrder !== null) return 1;
        return a.name.localeCompare(b.name);
      });

      setCategories(sortedCategories);
      setMenuItems(itemsData);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get first 2 items for each category
  const getFeaturedItemsByCategory = (categoryId) => {
    return menuItems
      .filter(item => {
        const itemCatId = typeof item.categoryId === 'number' ? item.categoryId : parseInt(item.categoryId);
        const catId = typeof categoryId === 'number' ? categoryId : parseInt(categoryId);
        return itemCatId === catId;
      })
      .slice(0, 2); // Get first 2 items
  };

  // Convert category name to section ID (lowercase, replace spaces with hyphens)
  const getSectionId = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  // Capitalize category name for display
  const capitalizeCategoryName = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleMenuItemClick = (itemName, categoryName) => {
    // Navigate to menu page with section parameter based on category
    const sectionId = getSectionId(categoryName);
    navigate(`/menu?section=${sectionId}`);
  };

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
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading menu items...</div>
              ) : (
                <div className="menu-preview-grid">
                  {categories.map((category) => {
                    const featuredItems = getFeaturedItemsByCategory(category.categoryId);
                    if (featuredItems.length === 0) return null; // Don't render empty categories
                    
                    return (
                      <div key={category.categoryId} className="menu-preview-category">
                        <h4>{capitalizeCategoryName(category.name)}</h4>
                        <div className="preview-items">
                          {featuredItems.map((item) => (
                            <div 
                              key={item.itemId} 
                              className="preview-item" 
                              onClick={() => handleMenuItemClick(item.name, category.name)} 
                              style={{cursor: 'pointer'}}
                            >
                              <img 
                                src={item.imageUrl || 'https://via.placeholder.com/300'} 
                                alt={item.name} 
                              />
                              <span>{item.name}</span>
                            </div>
                          ))}
              </div>
              </div>
                    );
                  })}
              </div>
              )}
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

// App component
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
