import React, { useState } from 'react';

// Individual menu category component
const MenuCategory = ({ title, items, onItemClick }) => {
    const [open, setOpen] = useState(false);
    
    const handleItemClick = (item) => {
        onItemClick(item);
        setOpen(false); // Close the dropdown after clicking
    };
    
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
                        <li key={index} onClick={() => handleItemClick(item)} style={{cursor: 'pointer'}}>
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

// Main MenuItems component
const MenuItems = () => {
    const scrollToSection = (itemName) => {
        // Map item names to section IDs
        const sectionMap = {
            // Appetizers
            "Mozzarella Sticks": "appetizers",
            "Chicken Wings": "appetizers", 
            "Fried Pickles": "appetizers",
            "Onion Rings": "appetizers",
            
            // Main Courses
            "Grilled Salmon": "main-courses",
            "Chicken Parmesan": "main-courses",
            "Beef Lasagna": "main-courses", 
            "Vegetable Stir-Fry": "main-courses",
            
            // Desserts
            "Cheesecake": "desserts",
            "Ice Cream": "desserts",
            "Chocolate Lava Cake": "desserts",
            "Fruit Salad": "desserts",
            
            // Beverages
            "Soda": "beverages",
            "Water": "beverages",
            "Coffee": "beverages",
            "Tea": "beverages"
        };
        
        const sectionId = sectionMap[itemName];
        if (sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    };

    return (
        <div className="menu-items">
            <h2>Our Menu</h2>
            <MenuCategory 
                title="Appetizers" 
                items={["Mozzarella Sticks", "Chicken Wings", "Fried Pickles", "Onion Rings"]}
                onItemClick={scrollToSection}
            />
            <MenuCategory 
                title="Main Courses" 
                items={["Grilled Salmon", "Chicken Parmesan", "Beef Lasagna", "Vegetable Stir-Fry"]}
                onItemClick={scrollToSection}
            />
            <MenuCategory 
                title="Desserts" 
                items={["Cheesecake", "Ice Cream", "Chocolate Lava Cake", "Fruit Salad"]}
                onItemClick={scrollToSection}
            />
            <MenuCategory 
                title="Beverages" 
                items={["Soda", "Water", "Coffee", "Tea"]}
                onItemClick={scrollToSection}
            />
        </div>
    )
}

export default MenuItems;