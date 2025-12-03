import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useNavigate, useLocation } from 'react-router-dom';

const CompletedOrder = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const formData = location.state?.formData || {};
    const cartItems = location.state?.cartItems || [];
    const orderTotal = location.state?.orderTotal || 0;
    const orderNumber = location.state?.orderNumber || 'N/A';
    
    return (
        <div className="completed-order-page">
            <Header />
            <main className="main">
                <h1>Your Order Has Been Placed!</h1>
                <div className="completed-order-content">
                    <h3>Order ID: {orderNumber}</h3>
                    <p>Estimated Delivery Time: 6:46pm</p>
                    
                    <div className="order-summary">
                        <h4>Order Summary</h4>
                        <table className="order-table">
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
                            <tfoot>
                                <tr className="total-row">
                                    <td colSpan="3"><strong>Total:</strong></td>
                                    <td><strong>${orderTotal.toFixed(2)}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    
                    <div className="order-actions">
                        <button className="btn btn-primary another-order-btn" onClick={() => navigate('/menu')}>Place Another Order</button>
                        <button className="btn btn-secondary back-to-home-btn" onClick={() => navigate('/')}>Back to Home</button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CompletedOrder;