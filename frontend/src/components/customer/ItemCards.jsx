import React, { useState, useEffect } from 'react';

const ItemCards = ({ items }) => {
    const [quantities, setQuantities] = useState({});

    const handleQuantityChange = (itemName, value) => {
        setQuantities(prev => ({
            ...prev,
            [itemName]: parseInt(value) || 0
        }));
    };

    const handleAddToCart = (item) => {
        const quantity = quantities[item.name] || 0;
        
        console.log('handleAddToCart called with:', { item, quantity }); // Debug log
        console.log('window.addToCart exists:', !!window.addToCart); // Debug log
        
        if (window.addToCart) {
            // Price is already a number from the database, format it for display
            const price = typeof item.price === 'number' ? item.price : parseFloat(item.price.toString().replace('$', ''));
            console.log('Calling addToCart with:', { name: item.name, quantity, price, itemId: item.itemId }); // Debug log
            window.addToCart(item.name, quantity, price, item.itemId);
            // Reset quantity after adding
            setQuantities(prev => ({
                ...prev,
                [item.name]: 0
            }));
        } else {
            console.error('window.addToCart function not found!'); // Debug log
        }
    };

    // Format price for display
    const formatPrice = (price) => {
        if (typeof price === 'number') {
            return `$${price.toFixed(2)}`;
        }
        if (typeof price === 'string') {
            return price.startsWith('$') ? price : `$${price}`;
        }
        return '$0.00';
    };

    return (
        <div className="item-cards">
            {items.map((item, index) => (
                <div className="item-card" key={item.itemId || index}>
                    <img src={item.imageUrl || item.image || 'https://via.placeholder.com/300'} alt={item.name} className="item-image"/>
                    <h3>{item.name} - {formatPrice(item.price)}</h3>
                    <p>{item.description || ''}</p>
                    <div className="item-card-quantity">
                        <button 
                            onClick={() => handleQuantityChange(item.name, (quantities[item.name] || 0) - 1)}
                            disabled={(quantities[item.name] || 0) <= 0}
                        >-</button>
                        <input 
                            type="number" 
                            placeholder="0"
                            value={quantities[item.name] || ''}
                            onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                            min="0"
                        />
                        <button 
                            onClick={() => handleQuantityChange(item.name, (quantities[item.name] || 0) + 1)}
                        >+</button>
                    </div>
                    <button 
                        onClick={() => handleAddToCart(item)}
                        disabled={(quantities[item.name] || 0) <= 0}
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    )
}

import { API_BASE_URL } from '../../config/api.js';

const Items = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Fetch both categories and menu items
            const [categoriesResponse, itemsResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/menu/categories`),
                fetch(`${API_BASE_URL}/menu/items`)
            ]);

            if (!categoriesResponse.ok) {
                const errorText = await categoriesResponse.text();
                console.error('Categories API error:', categoriesResponse.status, errorText);
                throw new Error(`Failed to fetch categories: ${categoriesResponse.status}`);
            }

            if (!itemsResponse.ok) {
                const errorText = await itemsResponse.text();
                console.error('Items API error:', itemsResponse.status, errorText);
                throw new Error(`Failed to fetch items: ${itemsResponse.status}`);
            }

            const categoriesData = await categoriesResponse.json();
            const itemsData = await itemsResponse.json();

            console.log('Fetched categories:', categoriesData);
            console.log('Fetched items:', itemsData);

            // Sort categories by displayOrder if available, otherwise by name
            const sortedCategories = categoriesData.sort((a, b) => {
                if (a.displayOrder !== null && b.displayOrder !== null) {
                    return a.displayOrder - b.displayOrder;
                }
                if (a.displayOrder !== null) return -1;
                if (b.displayOrder !== null) return 1;
                return a.name.localeCompare(b.name);
            });

            // Ensure items have categoryId - handle both direct categoryId and nested category object
            const processedItems = itemsData.map(item => {
                if (item.categoryId) {
                    return item;
                }
                // If categoryId is not directly on item, try to get it from nested category object
                if (item.category && item.category.categoryId) {
                    return { ...item, categoryId: item.category.categoryId };
                }
                return item;
            });

            console.log('Processed items:', processedItems);
            console.log('Categories count:', sortedCategories.length);
            console.log('Items count:', processedItems.length);

            setCategories(sortedCategories);
            setMenuItems(processedItems);
        } catch (error) {
            console.error('Error fetching menu data:', error);
            setError(`Failed to load menu items: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Group menu items by category
    const getItemsByCategory = (categoryId) => {
        // Ensure both values are compared as numbers
        const catId = typeof categoryId === 'number' ? categoryId : parseInt(categoryId);
        return menuItems.filter(item => {
            const itemCatId = typeof item.categoryId === 'number' ? item.categoryId : parseInt(item.categoryId);
            return itemCatId === catId;
        });
    };

    // Convert category name to section ID (lowercase, replace spaces with hyphens)
    const getSectionId = (categoryName) => {
        return categoryName.toLowerCase().replace(/\s+/g, '-');
    };

    // Capitalize category name for display (capitalize first letter of each word)
    const capitalizeCategoryName = (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    if (loading) {
        return <div>Loading menu items...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="items">
            {categories.map((category) => {
                const items = getItemsByCategory(category.categoryId);
                if (items.length === 0) return null; // Don't render empty categories
                
                return (
                    <div key={category.categoryId}>
                        <h2 id={getSectionId(category.name)}>{capitalizeCategoryName(category.name)}</h2>
                        <ItemCards items={items} />
                    </div>
                );
            })}
        </div>
    )
}

export default Items;
