import React, { useEffect, useRef, useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useAuth } from '../utils/auth.jsx';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

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

    const clearTimeouts = () => {
        timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
        timeoutRefs.current = [];
    };

    useEffect(() => {
        return () => clearTimeouts();
    }, []);

    useEffect(() => {
        fetchOldestPendingOrder();
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

    const fetchOldestPendingOrder = async () => {
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
            
            // Sort orders by created_at ascending to get the oldest first
            const sortedOrders = orders.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateA - dateB; // Ascending order (oldest first)
            });
            
            console.log('Sorted orders (oldest first):', sortedOrders);
            
            // Get the oldest pending order
            if (sortedOrders && sortedOrders.length > 0) {
                const oldestOrder = sortedOrders[0];
                console.log('Oldest pending order:', oldestOrder);
                setCurrentOrder(oldestOrder);
                
                // Fetch order items for this order
                const itemsResponse = await fetch(`${API_BASE_URL}/orders/${oldestOrder.orderId}/items`);
                console.log('Fetching items for order:', oldestOrder.orderId);
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
                if (oldestOrder.addressId) {
                    console.log('Fetching delivery address with addressId:', oldestOrder.addressId);
                    const addressResponse = await fetch(`${API_BASE_URL}/delivery-addresses/${oldestOrder.addressId}`);
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

    /**
     * Calculate ETA for orders that don't have one (fallback for old orders)
     * Uses the same logic as the backend
     * @param {Array} items - Array of order items with quantities
     * @param {Date} orderCreatedAt - When the order was created
     * @returns {Date} - Estimated delivery time
     */
    const calculateETAFallback = (items, orderCreatedAt) => {
        if (!items || items.length === 0 || !orderCreatedAt) {
            return null;
        }

        // Calculate total quantity of items
        const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        
        // Base preparation time: 22 minutes
        const baseMinutes = 22;
        
        // Additional time per item: 2.5 minutes per item
        const minutesPerItem = 2.5;
        const additionalMinutes = totalQuantity * minutesPerItem;
        
        // For very large orders (10+ items), add extra buffer
        const largeOrderBuffer = totalQuantity >= 10 ? 5 : 0;
        
        // Total estimated minutes
        const totalMinutes = baseMinutes + additionalMinutes + largeOrderBuffer;
        
        // Round to nearest 5 minutes for cleaner display
        const roundedMinutes = Math.ceil(totalMinutes / 5) * 5;
        
        // Calculate ETA from order creation time
        const orderDate = new Date(orderCreatedAt);
        const etaDate = new Date(orderDate.getTime() + roundedMinutes * 60 * 1000);
        
        return etaDate;
    };

    /**
     * Format ETA for display (ETA is calculated by backend, with fallback for old orders)
     * @param {string} estimatedDeliveryTime - Estimated delivery time from backend (ISO string)
     * @param {Array} orderItems - Order items for fallback calculation
     * @param {string} createdAt - Order creation time for fallback calculation
     * @returns {string} - Formatted time string
     */
    const formatETA = (estimatedDeliveryTime, orderItems, createdAt) => {
        // If no ETA from backend, calculate it as fallback (for old orders)
        let etaDate = null;
        if (estimatedDeliveryTime) {
            try {
                etaDate = new Date(estimatedDeliveryTime);
            } catch (error) {
                console.error('Error parsing estimatedDeliveryTime:', error);
            }
        }
        
        // Fallback calculation for orders without ETA
        if (!etaDate && orderItems && createdAt) {
            etaDate = calculateETAFallback(orderItems, createdAt);
        }
        
        if (!etaDate) return 'TBD';
        
        try {
            // Format as single time (e.g., "6:30 PM")
            const formatTime = (date) => {
                return date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
            };
            
            return formatTime(etaDate);
        } catch (error) {
            console.error('Error formatting ETA:', error);
            return 'TBD';
        }
    };

    const handleDriverChange = (e) => {
        const selectedDriver = e.target.value;
        setDriver(selectedDriver);
    };

    const saveToQueue = async () => {
        if (!currentOrder) {
            setQueueSuccessMessage('No order selected');
            setIsQueueFadingOut(false);
            return;
        }
        
        if (!driver) {
            setQueueSuccessMessage('Please select a driver first');
            setIsQueueFadingOut(false);
            return;
        }
        
        try {
            clearTimeouts();
            setQueueSuccessMessage('Saving order to queue...');
            setIsQueueFadingOut(false);
            
            const response = await fetch(`${API_BASE_URL}/orders/${currentOrder.orderId}/save-to-queue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    driverFullName: driver
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to save order to queue: ${response.status} ${errorText}`);
            }
            
            const updatedOrder = await response.json();
            
            // Refresh available drivers (the assigned driver should no longer be available)
            fetchAvailableDrivers();
            
            setQueueSuccessMessage('Order saved to queue successfully! 📋');
            
            registerTimeout(() => {
                setIsQueueFadingOut(true);
            }, 3500);

            registerTimeout(() => {
                setQueueSuccessMessage('');
                setIsQueueFadingOut(false);
                // Refresh to get the next oldest pending order (current order is now IN_ROUTE)
                fetchOldestPendingOrder();
            }, 4000);
        } catch (error) {
            console.error('Error saving order to queue:', error);
            setQueueSuccessMessage('Failed to save order to queue. Please try again.');
            setIsQueueFadingOut(false);
            
            registerTimeout(() => {
                setIsQueueFadingOut(true);
            }, 3500);

            registerTimeout(() => {
                setQueueSuccessMessage('');
                setIsQueueFadingOut(false);
            }, 4000);
        }
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
                        {currentOrder ? (
                            <p className="dashboard-meta muted">
                                ETA: {formatETA(currentOrder.estimatedDeliveryTime, orderItems, currentOrder.createdAt)}
                            </p>
                        ) : (
                            <p className="dashboard-meta muted">ETA: TBD</p>
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
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const timeoutsRef = useRef([]);

    const clearTimeouts = () => {
        timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        timeoutsRef.current = [];
    };

    useEffect(() => {
        return () => clearTimeouts();
    }, []);

    useEffect(() => {
        fetchDeliveredOrders();
        // Refresh the list every 30 seconds to get newly delivered orders
        const interval = setInterval(fetchDeliveredOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchDeliveredOrders = async () => {
        try {
            setOrdersLoading(true);
            // Fetch only delivered orders that don't have a delivery timestamp yet
            const response = await fetch(`${API_BASE_URL}/orders/delivered/without-timestamp`);
            if (!response.ok) {
                throw new Error('Failed to fetch delivered orders');
            }
            const orders = await response.json();
            console.log('Fetched delivered orders without timestamp:', orders);
            setDeliveredOrders(orders);
        } catch (error) {
            console.error('Error fetching delivered orders:', error);
            setDeliveredOrders([]);
        } finally {
            setOrdersLoading(false);
        }
    };

    const registerTimeout = (callback, delay) => {
        const timeout = setTimeout(callback, delay);
        timeoutsRef.current.push(timeout);
        return timeout;
    };

    const isButtonDisabled = () => {
        return !orderId || !timeOfOutcome;
    };

    const handleRecordDelivery = async () => {
        if (!orderId || !timeOfOutcome) {
            setSuccessMessage('Please select an order and enter the time of outcome');
            setIsFadingOut(false);
            registerTimeout(() => {
                setIsFadingOut(true);
            }, 3000);
            registerTimeout(() => {
                setSuccessMessage('');
                setIsFadingOut(false);
            }, 3500);
            return;
        }
        
        try {
            clearTimeouts();
            setSuccessMessage('Recording delivery...');
            setIsFadingOut(false);
            
            const response = await fetch(`${API_BASE_URL}/orders/${orderId}/record-delivery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timeOfOutcome: timeOfOutcome
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to record delivery');
            }
            
            // Refresh the delivered orders list to remove the one we just recorded
            await fetchDeliveredOrders();
            
            // Clear the form
            setOrderId('');
            setTimeOfOutcome('');
            
            setSuccessMessage('Delivery recorded successfully! 📝');
            
            registerTimeout(() => {
                setIsFadingOut(true);
            }, 3500);

            registerTimeout(() => {
                setSuccessMessage('');
                setIsFadingOut(false);
            }, 4000);
        } catch (error) {
            console.error('Error recording delivery:', error);
            setSuccessMessage('Failed to record delivery. Please try again.');
            setIsFadingOut(false);
            
            registerTimeout(() => {
                setIsFadingOut(true);
            }, 3500);

            registerTimeout(() => {
                setSuccessMessage('');
                setIsFadingOut(false);
            }, 4000);
        }
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
                                disabled={ordersLoading}
                            >
                                <option value="">Select an order</option>
                                {deliveredOrders.map((order) => (
                                    <option key={order.orderId} value={order.orderId}>
                                        {order.orderId}
                                    </option>
                                ))}
                            </select>
                            {ordersLoading && <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>Loading orders...</p>}
                            {!ordersLoading && deliveredOrders.length === 0 && (
                                <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>No delivered orders available</p>
                            )}
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