import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { DRIVERS, useAuth } from '../utils/auth.jsx';
import { useNavigate } from 'react-router-dom';

const RetrieveOrderDashboardSection = () => {
    const [driver, setDriver] = useState('');
    const [deliveryTime, setDeliveryTime] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [queueSuccessMessage, setQueueSuccessMessage] = useState('');
    const [isQueueFadingOut, setIsQueueFadingOut] = useState(false);
    const timeoutRefs = useRef([]);

    const clearTimeouts = () => {
        timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        timeoutRefs.current = [];
    };

    useEffect(() => {
        return () => clearTimeouts();
    }, []);

    const registerTimeout = (callback, delay) => {
        const timeout = setTimeout(callback, delay);
        timeoutRefs.current.push(timeout);
        return timeout;
    };

    const generateRandomDeliveryTime = () => {
        const minTime = 15;
        const maxTime = 45;
        return Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    };

    const handleDriverChange = (e) => {
        const selectedDriver = e.target.value;
        setDriver(selectedDriver);

        if (selectedDriver) {
            const randomTime = generateRandomDeliveryTime();
            setDeliveryTime(randomTime);
        } else {
            setDeliveryTime('');
        }
    };

    const handleAssignDriver = () => {
        clearTimeouts();
        setSuccessMessage('Driver assigned successfully! 🚚');
        setIsFadingOut(false);

        registerTimeout(() => {
            setIsFadingOut(true);
        }, 3500);

        registerTimeout(() => {
            setSuccessMessage('');
            setIsFadingOut(false);
        }, 4000);
    };

    const saveToQueue = () => {
        clearTimeouts();
        setQueueSuccessMessage('Order saved to queue successfully! 📋');
        setIsQueueFadingOut(false);

        registerTimeout(() => {
            setIsQueueFadingOut(true);
        }, 3500);

        registerTimeout(() => {
            setQueueSuccessMessage('');
            setIsQueueFadingOut(false);
        }, 4000);
    };

    return (
        <section className="dashboard-section retrieve-order-section">
            <div className="dashboard-section-heading">
                <div>
                    <h2>Retrieve Order</h2>
                    <p className="dashboard-section-subtitle">Review the latest order and assign a driver right from here.</p>
                </div>
                <div className="dashboard-section-meta">
                    <span className="status-dot in-progress" aria-hidden="true"></span>
                    <span className="status-label">Order in progress</span>
                </div>
            </div>
            {successMessage && <div className={`success-message ${isFadingOut ? 'fade-out' : ''}`}>{successMessage}</div>}
            {queueSuccessMessage && <div className={`success-message ${isQueueFadingOut ? 'fade-out' : ''}`}>{queueSuccessMessage}</div>}
            <div className="dashboard-grid retrieve-order-grid">
                <div className="dashboard-card order-card">
                    <div className="dashboard-card-header">
                        <h3>Order Summary</h3>
                        <p className="dashboard-meta">Order ID #1234567890</p>
                    </div>
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
                <div className="dashboard-card customer-card">
                    <div className="dashboard-card-header">
                        <h3>Customer Information</h3>
                        <p className="dashboard-meta muted">Delivery Window: 6:30 – 7:00 PM</p>
                    </div>
                    <ul className="customer-details">
                        <li>
                            <span className="label">Name</span>
                            <span className="value">John Doe</span>
                        </li>
                        <li>
                            <span className="label">Phone</span>
                            <span className="value">123-456-7890</span>
                        </li>
                        <li>
                            <span className="label">Address</span>
                            <span className="value">123 Main St, Anytown, USA</span>
                        </li>
                        <li>
                            <span className="label">Instructions</span>
                            <span className="value">Ring the bell once &amp; leave at doorstep.</span>
                        </li>
                    </ul>
                </div>
                <div className="dashboard-card assign-card">
                    <div className="dashboard-card-header">
                        <h3>Assign Driver</h3>
                        <p className="dashboard-meta muted">Select driver &amp; confirm ETA</p>
                    </div>
                    <div className="form-grid compact">
                        <div className="form-field">
                            <label htmlFor="dashboard-driver">Driver</label>
                            <select
                                id="dashboard-driver"
                                value={driver}
                                onChange={handleDriverChange}
                                className="dashboard-input"
                            >
                                <option value="">Select a driver</option>
                                {DRIVERS.map((driverItem, index) => (
                                    <option key={index} value={`${driverItem.first_name} ${driverItem.last_name}`}>
                                        {driverItem.first_name} {driverItem.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="dashboard-delivery-time">ETA (minutes)</label>
                            <input
                                type="number"
                                id="dashboard-delivery-time"
                                value={deliveryTime}
                                onChange={(e) => setDeliveryTime(e.target.value)}
                                min="0"
                                className="dashboard-input"
                                placeholder="e.g. 28"
                            />
                        </div>
                    </div>
                    <button
                        className="btn btn-primary btn-full"
                        disabled={!driver || !deliveryTime}
                        onClick={handleAssignDriver}
                    >
                        Assign Driver
                    </button>
                </div>
            </div>
            <div className="dashboard-section-actions">
                <button className="btn btn-secondary" onClick={saveToQueue}>Save Order to Queue</button>
            </div>
        </section>
    );
};

const RecordDeliveryDashboardSection = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [timeOfOutcome, setTimeOfOutcome] = useState('');
    const timeoutsRef = useRef([]);

    const clearTimeouts = () => {
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current = [];
    };

    useEffect(() => {
        return () => clearTimeouts();
    }, []);

    const registerTimeout = (callback, delay) => {
        const timeout = setTimeout(callback, delay);
        timeoutsRef.current.push(timeout);
        return timeout;
    };

    const isButtonDisabled = () => {
        return !orderId || !timeOfOutcome;
    };

    const handleRecordDelivery = () => {
        clearTimeouts();
        setSuccessMessage('Delivery recorded successfully! 📝');
        setIsFadingOut(false);

        registerTimeout(() => {
            setIsFadingOut(true);
        }, 3500);

        registerTimeout(() => {
            setSuccessMessage('');
            setIsFadingOut(false);
        }, 4000);
    };

    return (
        <section className="dashboard-section record-delivery-section">
            <div className="dashboard-section-heading">
                <div>
                    <h2>Record Delivery</h2>
                    <p className="dashboard-section-subtitle">Log delivery outcomes without leaving your dashboard.</p>
                </div>
                <div className="dashboard-section-meta">
                    <span className="status-dot idle" aria-hidden="true"></span>
                    <span className="status-label">Awaiting update</span>
                </div>
            </div>
            {successMessage && <div className={`success-message ${isFadingOut ? 'fade-out' : ''}`}>{successMessage}</div>}
            <div className="dashboard-card form-card">
                <div className="dashboard-card-header">
                    <h3>Delivery Details</h3>
                    <p className="dashboard-meta muted">Capture proof of delivery</p>
                </div>
                <form className="record-delivery-form">
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="dashboard-order-id">Order ID</label>
                            <select
                                id="dashboard-order-id"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="dashboard-input"
                            >
                                <option value="">Select an order</option>
                                <option value="1234567890">1234567890</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label htmlFor="dashboard-time-of-outcome">Time of Outcome</label>
                            <input
                                type="datetime-local"
                                id="dashboard-time-of-outcome"
                                value={timeOfOutcome}
                                onChange={(e) => setTimeOfOutcome(e.target.value)}
                                className="dashboard-input"
                            />
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="dashboard-delivery-notes">Delivery Notes</label>
                        <textarea
                            id="dashboard-delivery-notes"
                            rows="4"
                            placeholder="Enter delivery notes..."
                            className="dashboard-input"
                        ></textarea>
                    </div>
                    <div className="dashboard-form-actions">
                        <button
                            type="button"
                            className="btn btn-primary btn-full-mobile"
                            disabled={isButtonDisabled()}
                            onClick={handleRecordDelivery}
                        >
                            Record Delivery
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const goToManageStaff = () => {
        if (user.username === "admin") {
            navigate('/manage-staff');
        } else {
            navigate('/login');
        }
    };

    const goToManageDrivers = () => {
        if (user.username === "admin") {
            navigate('/manage-drivers');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="dashboard-page">
            <Header />
            <main className="main">
                {user.username === "admin" ? (
                    <>
                        <h1>Admin Panel</h1>
                        <div className="admin-dashboard-buttons">
                            <button onClick={goToManageStaff}>Manage Staff</button>
                            <button onClick={goToManageDrivers}>Manage Drivers</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Welcome, {user.first_name}!</h1>
                        <p className="staff-dashboard-intro">
                            Here’s everything you need to manage today’s deliveries at a glance.
                        </p>
                        <div className="staff-dashboard-grid">
                            <RetrieveOrderDashboardSection />
                            <RecordDeliveryDashboardSection />
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;