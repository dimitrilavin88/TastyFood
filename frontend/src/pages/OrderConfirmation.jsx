import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import PaymentPopup from '../components/customer/PaymentPopup';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get cart items from navigation state, fallback to empty array
    const cartItems = location.state?.cartItems || [];
    const cartTotal = location.state?.total || 0;
    
    // Calculate service fee (8.25%)
    const serviceFee = cartTotal * 0.0825;
    const [tipAmount, setTipAmount] = useState(0);
    const grandTotal = cartTotal + serviceFee + tipAmount;
    
    // Payment popup state
    const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);

    const handlePaymentSuccess = (paymentData) => {
        console.log('Payment successful:', paymentData);
        // Here you would typically send the payment data to your backend
        // For now, we'll just show a success message and redirect
        alert('Payment successful! Your order has been placed.');
        navigate('/menu');
    };

    return (
        <div className="order-confirmation-page">
            <Header />
            <main className="main">
                <h1>Order Confirmation</h1>
                <div className="order-confirmation-layout">
                    <div className="order-confirmation-content">
                        <h2>Cart Details</h2>
                        {cartItems.length === 0 ? (
                            <div className="empty-cart-message">
                                <p>No items in cart. Please go back to the menu to add items.</p>
                                <button className="btn btn-primary" onClick={() => navigate('/menu')}>Go to Menu</button>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.quantity}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>${item.total.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="proceed-to-payment">
                        <h2>Payment Details</h2>
                        <p>Total before Service Fee: ${cartTotal.toFixed(2)}</p>
                        <p>Service Fee (8.25%): ${serviceFee.toFixed(2)}</p>
                        <label htmlFor="tip-amount">Enter Tip Amount</label>
                        <input 
                            type="number" 
                            id="tip-amount" 
                            value={tipAmount}
                            onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.01"
                        />
                        <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>
                        <button className="btn btn-primary proceed-to-payment-btn" onClick={() => setIsPaymentPopupOpen(true)}>Proceed to Payment</button>
                        <button className="back-to-menu-btn" onClick={() => navigate('/menu')}>Back to Menu</button>
                    </div>
                </div>
            </main>
            <Footer />
            
            <PaymentPopup
                isOpen={isPaymentPopupOpen}
                onClose={() => setIsPaymentPopupOpen(false)}
                onPaymentSuccess={handlePaymentSuccess}
                orderTotal={grandTotal}
                cartItems={cartItems}
                tipAmount={tipAmount}
                subtotal={cartTotal + serviceFee}
            />
        </div>
    )
}

export default OrderConfirmation;