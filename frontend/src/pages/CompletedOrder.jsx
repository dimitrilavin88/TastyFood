import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

const CompletedOrder = () => {
    const navigate = useNavigate();
    return (
        <div className="completed-order-page">
            <Header />
            <main className="main">
                <h1>Completed Order</h1>
                <div className="completed-order-content">
                    <h2>Order Details</h2>
                    <p>Order ID: 1234567890</p>
                    <p>Order Date: 2021-01-01</p>
                    <p>Order Total: $100.00</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CompletedOrder;