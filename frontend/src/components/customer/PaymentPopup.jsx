import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import visaImage from '../../assets/visa.jpg';
import mastercardImage from '../../assets/mastercard.png';
import amexImage from '../../assets/amex.png';
import discoverImage from '../../assets/discover.png';

const PaymentPopup = ({ isOpen, onClose, onPaymentSuccess, orderTotal, cartItems }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cardOwner: '',
        cardNumber: '',
        cvv: '',
        expiryDate: '',
        buildingNumber: '',
        street: '',
        aptUnit: '',
        city: '',
        state: '',
        zipCode: ''
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedCardType, setSelectedCardType] = useState('');

    const handleCardTypeSelect = (cardType) => {
        setSelectedCardType(cardType);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Format card number (add spaces every 4 digits) - numbers only
        if (name === 'cardNumber') {
            const numericValue = value.replace(/\D/g, '');
            // Prevent card number from starting with 0
            const validNumericValue = numericValue.startsWith('0') ? '' : numericValue;
            const formattedValue = validNumericValue.replace(/(.{4})/g, '$1 ').trim();
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
        // Format expiry date (MM/YY) - numbers only
        else if (name === 'expiryDate') {
            const numericValue = value.replace(/\D/g, '');
            const formattedValue = numericValue.replace(/(\d{2})(\d{0,2})/, '$1/$2');
            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        }
        // Limit CVV to 3 digits - numbers only
        else if (name === 'cvv') {
            const numericValue = value.replace(/\D/g, '').slice(0, 3);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        }
        // Limit zip code to 5 digits - numbers only
        else if (name === 'zipCode') {
            const numericValue = value.replace(/\D/g, '').slice(0, 5);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        }
        // Building number - numbers only
        else if (name === 'buildingNumber') {
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        }
        // Card owner - letters and spaces only
        else if (name === 'cardOwner') {
            const alphabeticValue = value.replace(/[^a-zA-Z\s]/g, '');
            setFormData(prev => ({ ...prev, [name]: alphabeticValue }));
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
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Card owner validation
        if (!formData.cardOwner.trim()) {
            newErrors.cardOwner = 'Card owner name is required';
        } else if (formData.cardOwner.trim().split(' ').length < 2) {
            newErrors.cardOwner = 'Please enter full name (first and last name)';
        }

        // Card number validation
        const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
        if (!cardNumberDigits) {
            newErrors.cardNumber = 'Card number is required';
        } else if (cardNumberDigits.length !== 16) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        } else if (cardNumberDigits.startsWith('0')) {
            newErrors.cardNumber = 'Card number cannot start with 0';
        }

        // CVV validation
        if (!formData.cvv) {
            newErrors.cvv = 'CVV is required';
        } else if (formData.cvv.length !== 3) {
            newErrors.cvv = 'CVV must be 3 digits';
        }

        // Expiry date validation
        if (!formData.expiryDate) {
            newErrors.expiryDate = 'Expiry date is required';
        } else if (formData.expiryDate.length !== 5) {
            newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
        } else {
            const [month, year] = formData.expiryDate.split('/');
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;
            
            if (parseInt(month) < 1 || parseInt(month) > 12) {
                newErrors.expiryDate = 'Invalid month';
            } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                newErrors.expiryDate = 'Card has expired';
            }
        }

        // Billing address validation
        if (!formData.buildingNumber.trim()) {
            newErrors.buildingNumber = 'Building number is required';
        }
        if (!formData.street.trim()) {
            newErrors.street = 'Street name is required';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }
        if (!formData.zipCode) {
            newErrors.zipCode = 'Zip code is required';
        } else if (formData.zipCode.length !== 5) {
            newErrors.zipCode = 'Zip code must be 5 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);
        
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            onPaymentSuccess(formData);
            onClose();
        }, 2000);
    };

    const handleClose = () => {
        setFormData({
            cardOwner: '',
            cardNumber: '',
            cvv: '',
            expiryDate: '',
            buildingNumber: '',
            street: '',
            aptUnit: '',
            city: '',
            state: '',
            zipCode: ''
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="payment-popup-overlay">
            <div className="payment-popup">
                <div className="payment-popup-header">
                    <h2>Payment Information</h2>
                    <button className="close-btn" onClick={handleClose}>×</button>
                </div>
                
                <div className="payment-popup-content">
                    <form onSubmit={handleSubmit} className="payment-form">
                        {/* Card Information */}
                        <div className="form-section">
                            <h4>Card Information</h4>
                            
                            <div className="form-group">
                                <label htmlFor="cardOwner">Card Owner (Full Name)</label>
                                <input
                                    type="text"
                                    id="cardOwner"
                                    name="cardOwner"
                                    value={formData.cardOwner}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    className={errors.cardOwner ? 'error' : ''}
                                />
                                {errors.cardOwner && <span className="error-message">{errors.cardOwner}</span>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="cardNumber">Card Number</label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    placeholder="1234 5678 9012 3456"
                                    maxLength="19"
                                    className={errors.cardNumber ? 'error' : ''}
                                />
                                {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="cvv">CVV</label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        maxLength="3"
                                        className={errors.cvv ? 'error' : ''}
                                    />
                                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="expiryDate">Expiry Date</label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        placeholder="MM/YY"
                                        maxLength="5"
                                        className={errors.expiryDate ? 'error' : ''}
                                    />
                                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Billing Address */}
                        <div className="form-section">
                            <h4>Billing Address</h4>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="buildingNumber">Building Number</label>
                                    <input
                                        type="text"
                                        id="buildingNumber"
                                        name="buildingNumber"
                                        value={formData.buildingNumber}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        className={errors.buildingNumber ? 'error' : ''}
                                    />
                                    {errors.buildingNumber && <span className="error-message">{errors.buildingNumber}</span>}
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
                                        className={errors.street ? 'error' : ''}
                                    />
                                    {errors.street && <span className="error-message">{errors.street}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="aptUnit">Apartment/Unit (Optional)</label>
                                <input
                                    type="text"
                                    id="aptUnit"
                                    name="aptUnit"
                                    value={formData.aptUnit}
                                    onChange={handleInputChange}
                                    placeholder="Apt 4B"
                                />
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
                                        className={errors.city ? 'error' : ''}
                                    />
                                    {errors.city && <span className="error-message">{errors.city}</span>}
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
                                        className={errors.state ? 'error' : ''}
                                    />
                                    {errors.state && <span className="error-message">{errors.state}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="zipCode">Zip Code</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="12345"
                                        maxLength="5"
                                        className={errors.zipCode ? 'error' : ''}
                                    />
                                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                                </div>
                            </div>

                            {/* Card Type Selection */}
                            <div className="card-type-selection">
                                <label>Select Card Type</label>
                                <div className="card-type-icons">
                                    <button
                                        type="button"
                                        className={`card-type-btn ${selectedCardType === 'visa' ? 'selected' : ''}`}
                                        onClick={() => handleCardTypeSelect('visa')}
                                        title="Visa"
                                    >
                                        <img src={visaImage} alt="Visa" className="card-image" />
                                    </button>
                                    <button
                                        type="button"
                                        className={`card-type-btn ${selectedCardType === 'mastercard' ? 'selected' : ''}`}
                                        onClick={() => handleCardTypeSelect('mastercard')}
                                        title="MasterCard"
                                    >
                                        <img src={mastercardImage} alt="MasterCard" className="card-image" />
                                    </button>
                                    <button
                                        type="button"
                                        className={`card-type-btn ${selectedCardType === 'amex' ? 'selected' : ''}`}
                                        onClick={() => handleCardTypeSelect('amex')}
                                        title="American Express"
                                    >
                                        <img src={amexImage} alt="American Express" className="card-image" />
                                    </button>
                                    <button
                                        type="button"
                                        className={`card-type-btn ${selectedCardType === 'discover' ? 'selected' : ''}`}
                                        onClick={() => handleCardTypeSelect('discover')}
                                        title="Discover"
                                    >
                                        <img src={discoverImage} alt="Discover" className="card-image" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" disabled={isProcessing} onClick={() => {
                                if (validateForm()) {
                                    setIsProcessing(true);
                                    setTimeout(() => {
                                        setIsProcessing(false);
                                        navigate('/delivery-info', { state: { cartItems, orderTotal } });
                                        onClose();
                                    }, 1000);
                                }
                            }}>
                                {isProcessing ? 'Processing...' : `Pay $${orderTotal.toFixed(2)}`}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPopup;
