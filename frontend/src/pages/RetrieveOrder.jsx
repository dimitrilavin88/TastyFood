import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { DRIVERS } from '../utils/auth.jsx';

const RetrieveOrder = () => {
    const navigate = useNavigate();
    const [driver, setDriver] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [queueSuccessMessage, setQueueSuccessMessage] = useState('');
    const [isQueueFadingOut, setIsQueueFadingOut] = useState(false);

    const generateRandomDeliveryTime = () => {
        // Generate random time between 15-45 minutes
        const minTime = 15;
        const maxTime = 45;
        return Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    };

    const handleDriverChange = (e) => {
        const selectedDriver = e.target.value;
        setDriver(selectedDriver);
        
        // Generate random delivery time when a driver is selected
        if (selectedDriver) {
            const randomTime = generateRandomDeliveryTime();
            setDeliveryTime(randomTime);
        } else {
            setDeliveryTime('');
        }
    }

    const handleAssignDriver = () => {
        console.log('Driver assigned:', driver);
        console.log('Delivery time:', deliveryTime);
        setSuccessMessage('Driver assigned successfully! 🚚');
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

    const saveToQueue = () => {
        console.log('Saving to queue');
        setQueueSuccessMessage('Order saved to queue successfully! 📋');
        setIsQueueFadingOut(false);
        
        // Start fade out after 3.5 seconds
        setTimeout(() => {
            setIsQueueFadingOut(true);
        }, 3500);
        
        // Remove the message from DOM after fade out completes
        setTimeout(() => {
            setQueueSuccessMessage('');
            setIsQueueFadingOut(false);
        }, 4000);
    }

    const goToDashboard = () => {
        navigate('/dashboard');
    }

    return (
        <div className="retrieve-order-page">
            <Header />
            <main className="main">
                <h1>Retrieve Order</h1>
                <h2>Order ID: 1234567890</h2>
                {successMessage && <div className={`success-message ${isFadingOut ? 'fade-out' : ''}`}>{successMessage}</div>}
                {queueSuccessMessage && <div className={`success-message ${isQueueFadingOut ? 'fade-out' : ''}`}>{queueSuccessMessage}</div>}
                <div className="retrieve-order-content">
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Chicken Wings</td>
                                <td>2</td>
                            </tr>
                            <tr>
                                <td>Grilled Salmon</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td>Cheesecake</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td>Soda</td>
                                <td>2</td>
                            </tr>
                            <tr>
                                <td>Water</td>
                                <td>1</td>
                            </tr>
                            <tr>
                                <td>Coffee</td>
                                <td>1</td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="customer-info">
                    <h2>Customer Information</h2>
                    <p>Name: John Doe</p>
                    <p>Phone: 123-456-7890</p>
                    <p>Address: 123 Main St, Anytown, USA</p>
                    </div>
                    <div className="assign-driver">
                    <h2>Assign Driver</h2>
                    <label htmlFor="driver">Driver</label>
                    <select id="driver" value={driver} onChange={handleDriverChange}>
                        <option value="">Select a driver</option>
                        {DRIVERS.map((driverItem, index) => (
                            <option key={index} value={driverItem.first_name + ' ' + driverItem.last_name}>
                                {driverItem.first_name} {driverItem.last_name}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="delivery">Estimated Delivery Time (minutes)</label>
                    <input 
                        type="number" 
                        id="delivery" 
                        value={deliveryTime} 
                        onChange={(e) => setDeliveryTime(e.target.value)}
                    />
                    <button disabled={!driver || !deliveryTime} onClick={handleAssignDriver}>Assign Driver</button>
                    </div>
                </div>
                <div className="bottom-buttons">
                    <button className="btn btn-primary" onClick={saveToQueue}>Save to Queue</button>
                    <button className="btn btn-secondary" onClick={goToDashboard}>Back to Dashboard</button>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default RetrieveOrder;