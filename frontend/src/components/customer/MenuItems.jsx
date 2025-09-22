import React, { useState } from 'react';

// Individual menu category component
const MenuCategory = ({ title, items }) => {
    const [open, setOpen] = useState(false);
    
    return (
        <div className={`menu-category ${open ? 'open' : ''}`}>
            <button 
                className="menu-category-header"
                onClick={() => setOpen(!open)}
            >
                {title}
                <span className="menu-category-arrow">▼</span>
            </button>
            <div className="menu-category-items">
                <ul>
                    {items.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

// Main MenuItems component
const MenuItems = () => {
    return (
        <div className="menu-items">
            <h2>Our Menu</h2>
            <MenuCategory 
                title="Appetizers" 
                items={["Mozzarella Sticks", "Chicken Wings", "Fried Pickles", "Onion Rings"]} 
            />
            <MenuCategory 
                title="Main Courses" 
                items={["Grilled Salmon", "Chicken Parmesan", "Beef Lasagna", "Vegetable Stir-Fry"]} 
            />
            <MenuCategory 
                title="Desserts" 
                items={["Cheesecake", "Ice Cream", "Chocolate Lava Cake", "Fruit Salad"]} 
            />
            <MenuCategory 
                title="Beverages" 
                items={["Soda", "Water", "Coffee", "Tea"]} 
            />
        </div>
    )
}

export default MenuItems;