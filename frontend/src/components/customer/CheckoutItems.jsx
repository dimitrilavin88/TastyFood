import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



const CheckoutItems = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const addToCart = (itemName, quantity, price) => {
        if (!quantity || quantity <= 0) {
            setErrorMessage('Please enter a valid quantity greater than zero');
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        // Always add a new row for each "Add to Cart" action
        const newItem = {
            name: itemName,
            quantity: quantity,
            price: price,
            total: quantity * price,
            id: `${itemName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // More robust unique ID
        };
        
        console.log('Adding new item to cart:', newItem); // Debug log
        console.log('Current cart items:', cartItems); // Debug log
        
        setCartItems(prevCart => {
            const updatedCart = [...prevCart, newItem];
            console.log('Updated cart:', updatedCart); // Debug log
            return updatedCart;
        });
        setErrorMessage('');
    };

    const removeFromCart = (itemId) => {
        setCartItems(cartItems.filter(item => item.id !== itemId));
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.total, 0);
    };

    // Create a context or prop-based system for sharing addToCart function
    // For now, we'll expose it through window or create a simple context
    React.useEffect(() => {
        window.addToCart = addToCart;
        console.log('CheckoutItems: addToCart function set on window'); // Debug log
        return () => {
            delete window.addToCart;
            console.log('CheckoutItems: addToCart function removed from window'); // Debug log
        };
    }, [addToCart]);

    return (
        <>
            <button className="checkout-toggle-btn" onClick={toggleOpen}>
                🛒 Checkout ({cartItems.length})
                {cartItems.length > 0 && <span className="cart-indicator">!</span>}
            </button>
            {isOpen && (
                <>
                    <div className="checkout-overlay" onClick={toggleOpen}></div>
                    <div className={`checkout-sidebar ${isOpen ? 'open' : ''}`}>
                        <div className="checkout-header">
                            <h2>Checkout</h2>
                            <button className="close-btn" onClick={toggleOpen}>×</button>
                        </div>
                        <div className="checkout-content">
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <div className="debug-panel" style={{padding: '10px', background: '#333', color: 'white', fontSize: '12px', marginBottom: '10px'}}>
                                <div>Cart Items Count: {cartItems.length}</div>
                                <div>Total Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
                                <div>Cart Total: ${calculateTotal().toFixed(2)}</div>
                            </div>
                            <div className="checkout-items-list">
                                {cartItems.length === 0 ? (
                                    <div className="empty-cart">
                                        <p>Your cart is empty</p>
                                        <p>Add items from the menu to get started!</p>
                                    </div>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((item, index) => {
                                                console.log(`Rendering cart item ${index}:`, item); // Debug log
                                                return (
                                                    <tr key={item.id}>
                                                        <td>{item.name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>${item.price.toFixed(2)}</td>
                                                        <td>${item.total.toFixed(2)}</td>
                                                        <td>
                                                            <button 
                                                                className="remove-btn"
                                                                onClick={() => removeFromCart(item.id)}
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {cartItems.length > 0 && (
                                <div className="checkout-summary">
                                    <div className="total-row">
                                        <span>Total:</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <button className="btn btn-primary checkout-btn" onClick={() => navigate('/order-confirmation', { state: { cartItems, total: calculateTotal() } })}>Confirm Order</button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default CheckoutItems;