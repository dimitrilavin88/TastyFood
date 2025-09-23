import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';

const RecordDelivery = () => {
    const navigate = useNavigate();
    const [successMessage, setSuccessMessage] = useState('');
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [timeOfOutcome, setTimeOfOutcome] = useState('');

    const isButtonDisabled = () => {
        return !orderId || !timeOfOutcome;
    };

    const handleRecordDelivery = () => {
        console.log('Record delivery');
        setSuccessMessage('Delivery recorded successfully! 📝');
        setIsFadingOut(false);
        
        // Start fade out after 3.5 seconds
        setTimeout(() => {
            setIsFadingOut(true);
        }, 3500);
        
        // Remove the message from DOM after fade out completes
        setTimeout(() => {
            setSuccessMessage('');
            setIsFadingOut(false);
        }, 4000);
    }

    const goToDashboard = () => {
        navigate('/dashboard');
    }

    return (
        <div className="record-delivery-page">
            <Header />
            <main className="main">
                <h1>Record Delivery</h1>
                {successMessage && <div className={`success-message ${isFadingOut ? 'fade-out' : ''}`}>{successMessage}</div>}
                <div className="record-delivery-content">
                    <form className="record-delivery-form">
                        <label htmlFor="order-id">Order ID</label>
                        <select id="order-id" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                            <option value="">Select an order</option>
                            <option value="1">1234567890</option>
                        </select>
                        <label htmlFor="time-of-outcome">Time of Outcome</label>
                        <input type="datetime-local" id="time-of-outcome" value={timeOfOutcome} onChange={(e) => setTimeOfOutcome(e.target.value)} />
                        <label htmlFor="delivery-notes">Delivery Notes</label>
                        <textarea id="delivery-notes" rows="4" placeholder="Enter delivery notes..."></textarea>
                        <div className="bottom-buttons">
                            <button type="button" className="btn btn-primary" disabled={isButtonDisabled()} onClick={handleRecordDelivery}>Record Delivery</button>
                            <button type="button" className="btn btn-secondary" onClick={goToDashboard}>Back to Dashboard</button>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default RecordDelivery;