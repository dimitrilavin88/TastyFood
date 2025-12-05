import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useAuth } from '../utils/auth.jsx';
import { useNavigate } from 'react-router-dom';

const RetrieveOrderDashboardSection = () => {
    const [driver, setDriver] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [queueSuccessMessage, setQueueSuccessMessage] = useState('');
    const [isQueueFadingOut, setIsQueueFadingOut] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState(null);
    const [availableDrivers, setAvailableDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [driversLoading, setDriversLoading] = useState(true);
    const timeoutRefs = useRef([]);
    
    const API_BASE_URL = 'http://localhost:8080/api';

    const clearTimeouts = () => {
        timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        timeoutRefs.current = [];
    };

    useEffect(() => {
        return () => clearTimeouts();
    }, []);

    useEffect(() => {
        fetchMostRecentPendingOrder();
        fetchAvailableDrivers();
    }, []);
    
    const fetchAvailableDrivers = async () => {
        try {
            setDriversLoading(true);
            const response = await fetch(`${API_BASE_URL}/drivers/available`);
            if (!response.ok) {
                throw new Error('Failed to fetch available drivers');
            }
            const drivers = await response.json();
            console.log('Fetched available drivers:', drivers);
            setAvailableDrivers(drivers);
        } catch (error) {
            console.error('Error fetching available drivers:', error);
            setAvailableDrivers([]);
        } finally {
            setDriversLoading(false);
        }
    };

    const fetchMostRecentPendingOrder = async () => {
        try {
            setLoading(true);
            // Fetch all pending orders
            const response = await fetch(`${API_BASE_URL}/orders/status/pending`);
            console.log('Fetching pending orders from:', `${API_BASE_URL}/orders/status/pending`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to fetch orders:', response.status, errorText);
                throw new Error(`Failed to fetch orders: ${response.status} ${errorText}`);
            }
            const orders = await response.json();
            console.log('Fetched orders:', orders);
            
            // Sort orders by created_at descending to get the most recent first
            const sortedOrders = orders.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA; // Descending order (most recent first)
            });
            
            console.log('Sorted orders:', sortedOrders);
            
            // Get the most recent pending order
            if (sortedOrders && sortedOrders.length > 0) {
                const mostRecentOrder = sortedOrders[0];
                console.log('Most recent order:', mostRecentOrder);
                setCurrentOrder(mostRecentOrder);
                
                // Fetch order items for this order
                const itemsResponse = await fetch(`${API_BASE_URL}/orders/${mostRecentOrder.orderId}/items`);
                console.log('Fetching items for order:', mostRecentOrder.orderId);
                if (itemsResponse.ok) {
                    const items = await itemsResponse.json();
                    console.log('Fetched order items:', items);
                    
                    // Fetch menu items to get names
                    const menuItemsResponse = await fetch(`${API_BASE_URL}/menu/items`);
                    if (menuItemsResponse.ok) {
                        const menuItems = await menuItemsResponse.json();
                        const menuItemsMap = new Map(menuItems.map(item => [item.itemId, item]));
                        
                        // Map order items with menu item names
                        const itemsWithNames = items.map(orderItem => ({
                            ...orderItem,
                            menuItem: menuItemsMap.get(orderItem.itemId) || null
                        }));
                        console.log('Order items with names:', itemsWithNames);
                        setOrderItems(itemsWithNames);
                    } else {
                        setOrderItems(items);
                    }
                } else {
                    console.error('Failed to fetch order items:', itemsResponse.status);
                }
                
                // Fetch delivery address using addressId from the order
                if (mostRecentOrder.addressId) {
                    console.log('Fetching delivery address with addressId:', mostRecentOrder.addressId);
                    const addressResponse = await fetch(`${API_BASE_URL}/delivery-addresses/${mostRecentOrder.addressId}`);
                    if (addressResponse.ok) {
                        const address = await addressResponse.json();
                        console.log('Fetched delivery address from database:', address);
                        setDeliveryAddress(address);
                    } else {
                        const errorText = await addressResponse.text();
                        console.error('Failed to fetch delivery address:', addressResponse.status, errorText);
                        setDeliveryAddress(null);
                    }
                } else {
                    console.warn('Order does not have an addressId');
                    setDeliveryAddress(null);
                }
            } else {
                console.log('No pending orders found');
                setCurrentOrder(null);
                setOrderItems([]);
                setDeliveryAddress(null);
            }
        } catch (error) {
            console.error('Error fetching pending order:', error);
            setCurrentOrder(null);
            setOrderItems([]);
        } finally {
            setLoading(false);
        }
    };

    const registerTimeout = (callback, delay) => {
        const timeout = setTimeout(callback, delay);
        timeoutRefs.current.push(timeout);
        return timeout;
    };

    const handleDriverChange = (e) => {
        const selectedDriver = e.target.value;
        setDriver(selectedDriver);
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
                        {loading ? (
                            <p className="dashboard-meta">Loading...</p>
                        ) : currentOrder ? (
                            <p className="dashboard-meta">Order ID #{currentOrder.orderId}</p>
                        ) : (
                            <p className="dashboard-meta">No pending orders</p>
                        )}
                    </div>
                    {loading ? (
                        <div style={{ padding: '1rem', textAlign: 'center' }}>Loading order details...</div>
                    ) : currentOrder && orderItems.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.menuItem?.name || `Item #${item.itemId}`}</td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : currentOrder ? (
                        <div style={{ padding: '1rem', textAlign: 'center' }}>No items found for this order</div>
                    ) : (
                        <div style={{ padding: '1rem', textAlign: 'center' }}>No pending orders available</div>
                    )}
                </div>
                <div className="dashboard-card customer-card">
                    <div className="dashboard-card-header">
                        <h3>Customer Information</h3>
                        {currentOrder && currentOrder.estimatedDeliveryTime ? (
                            <p className="dashboard-meta muted">
                                Delivery Window: {new Date(currentOrder.estimatedDeliveryTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                            </p>
                        ) : (
                            <p className="dashboard-meta muted">Delivery Window: TBD</p>
                        )}
                    </div>
                    {currentOrder ? (
                        <ul className="customer-details">
                            <li>
                                <span className="label">Name</span>
                                <span className="value">{currentOrder.customerName || 'N/A'}</span>
                            </li>
                            <li>
                                <span className="label">Phone</span>
                                <span className="value">
                                    {currentOrder.customerPhone ? (
                                        currentOrder.customerPhone.length === 10 
                                            ? `${currentOrder.customerPhone.slice(0, 3)}-${currentOrder.customerPhone.slice(3, 6)}-${currentOrder.customerPhone.slice(6)}`
                                            : currentOrder.customerPhone
                                    ) : 'N/A'}
                                </span>
                            </li>
                            <li>
                                <span className="label">Address</span>
                                <span className="value">
                                    {deliveryAddress ? (
                                        (() => {
                                            const parts = [];
                                            if (deliveryAddress.buildingNumber) parts.push(deliveryAddress.buildingNumber);
                                            if (deliveryAddress.street) parts.push(deliveryAddress.street);
                                            if (deliveryAddress.aptUnit) parts.push(deliveryAddress.aptUnit);
                                            const addressLine = parts.join(' ');
                                            const cityStateZip = [deliveryAddress.city, deliveryAddress.state, deliveryAddress.zipCode].filter(Boolean).join(', ');
                                            return addressLine && cityStateZip ? `${addressLine}, ${cityStateZip}` : addressLine || cityStateZip || 'N/A';
                                        })()
                                    ) : loading ? (
                                        'Loading address...'
                                    ) : (
                                        'N/A'
                                    )}
                                </span>
                            </li>
                            <li>
                                <span className="label">Instructions</span>
                                <span className="value">{currentOrder.specialInstructions || 'No special instructions'}</span>
                            </li>
                        </ul>
                    ) : (
                        <ul className="customer-details">
                            <li>
                                <span className="label">Name</span>
                                <span className="value">N/A</span>
                            </li>
                            <li>
                                <span className="label">Phone</span>
                                <span className="value">N/A</span>
                            </li>
                            <li>
                                <span className="label">Address</span>
                                <span className="value">N/A</span>
                            </li>
                            <li>
                                <span className="label">Instructions</span>
                                <span className="value">N/A</span>
                            </li>
                        </ul>
                    )}
                </div>
                <div className="dashboard-card assign-card">
                    <div className="dashboard-card-header">
                        <h3>Assign Driver</h3>
                        <p className="dashboard-meta muted">Select an available driver</p>
                    </div>
                    <div className="form-field">
                        <label htmlFor="dashboard-driver">Driver</label>
                        <select
                            id="dashboard-driver"
                            value={driver}
                            onChange={handleDriverChange}
                            className="dashboard-input"
                            disabled={driversLoading}
                        >
                            <option value="">Select a driver</option>
                            {availableDrivers.map((driverItem) => (
                                <option key={driverItem.driverId} value={driverItem.fullName}>
                                    {driverItem.fullName}
                                </option>
                            ))}
                        </select>
                        {driversLoading && <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>Loading drivers...</p>}
                        {!driversLoading && availableDrivers.length === 0 && (
                            <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>No available drivers</p>
                        )}
                    </div>
                    <button
                        className="btn btn-primary btn-full"
                        disabled={!driver}
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