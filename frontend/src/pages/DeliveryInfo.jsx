import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import CompletedOrder from './CompletedOrder';

const DeliveryInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [successMessage, setSuccessMessage] = useState('');
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    // Get cart items from navigation state
    const cartItems = location.state?.cartItems || [];
    const orderTotal = location.state?.orderTotal || 0;
    
    // Form data state
    const [formData, setFormData] = useState({
        buildingNumber: '',
        street: '',
        aptUnit: '',
        city: '',
        state: '',
        zipCode: '',
        name: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Building number - numbers only
        if (name === 'buildingNumber') {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        }
        // Street - letters, numbers, spaces, and common address characters
        else if (name === 'street') {
            const addressValue = value.replace(/[^a-zA-Z0-9\s\-\.]/g, '');
            setFormData(prev => ({ ...prev, [name]: addressValue }));
        }
        // Apt/Unit - letters, numbers, spaces, and common unit characters
        else if (name === 'aptUnit') {
            const unitValue = value.replace(/[^a-zA-Z0-9\s\-]/g, '');
            setFormData(prev => ({ ...prev, [name]: unitValue }));
        }
        // City - letters and spaces only
        else if (name === 'city') {
            const alphabeticValue = value.replace(/[^a-zA-Z\s]/g, '');
            setFormData(prev => ({ ...prev, [name]: alphabeticValue }));
        }
        // State - letters only (no spaces for state abbreviations)
        else if (name === 'state') {
            const alphabeticValue = value.replace(/[^a-zA-Z]/g, '');
            setFormData(prev => ({ ...prev, [name]: alphabeticValue }));
        }
        // Zip code - numbers only, max 5 digits
        else if (name === 'zipCode') {
            const numericValue = value.replace(/\D/g, '').slice(0, 5);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        }
        // Name - letters and spaces only
        else if (name === 'name') {
            const alphabeticValue = value.replace(/[^a-zA-Z\s]/g, '');
            setFormData(prev => ({ ...prev, [name]: alphabeticValue }));
        }
        // Phone - numbers only, max 10 digits
        else if (name === 'phone') {
            const phoneValue = value.replace(/[^0-9]/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: phoneValue }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const requiredFields = ['buildingNumber', 'street', 'city', 'state', 'zipCode', 'name', 'phone'];
        const emptyFields = requiredFields.filter(field => !formData[field].trim());
        
        if (emptyFields.length > 0) {
            setErrorMessage('Please fill out all required fields before placing your order.');
            setTimeout(() => setErrorMessage(''), 5000);
            return false;
        }
        
        // Additional validation for specific fields
        if (formData.zipCode.length !== 5) {
            setErrorMessage('Please enter a valid 5-digit zip code.');
            setTimeout(() => setErrorMessage(''), 5000);
            return false;
        }
        
        if (formData.name.trim().split(' ').length < 2) {
            setErrorMessage('Please enter your full name (first and last name).');
            setTimeout(() => setErrorMessage(''), 5000);
            return false;
        }
        
        if (formData.phone.length !== 10) {
            setErrorMessage('Please enter a valid 10-digit phone number.');
            setTimeout(() => setErrorMessage(''), 5000);
            return false;
        }
        
        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }
        
        navigate('/completed-order', { state: { formData, cartItems, orderTotal } });
    };

    return (
        <div className="delivery-info-page">
            <Header />
            <main className="main">
                <h1>Delivery Information</h1>
                {successMessage && <div className={`success-message ${isFadingOut ? 'fade-out' : ''}`}>{successMessage}</div>}
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <div className="delivery-info-content">
                    <div className="address-section">
                        <h3>Delivery Address</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="building-number">Building Number</label>
                                <input 
                                    type="text" 
                                    id="building-number" 
                                    name="buildingNumber"
                                    value={formData.buildingNumber}
                                    onChange={handleInputChange}
                                    placeholder="123"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="street">Street</label>
                                <input 
                                    type="text" 
                                    id="street" 
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="Main Street"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="apt-unit">Apt/Unit (Optional)</label>
                                <input 
                                    type="text" 
                                    id="apt-unit" 
                                    name="aptUnit"
                                    value={formData.aptUnit}
                                    onChange={handleInputChange}
                                    placeholder="Apt 4B"
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City</label>
                                <input 
                                    type="text" 
                                    id="city" 
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="New York"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State</label>
                                <input 
                                    type="text" 
                                    id="state" 
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="NY"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zip-code">Zip Code</label>
                                <input 
                                    type="text" 
                                    id="zip-code" 
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    placeholder="12345"
                                    maxLength="5"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="contact-section">
                        <h3>Contact Information</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Full Name (First and Last)</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input 
                                    type="text" 
                                    id="phone" 
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="1234567890"
                                    maxLength="10"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bottom-button">
                    <button className="btn btn-primary" onClick={handleSubmit}>Place Order</button>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DeliveryInfo;