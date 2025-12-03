import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8080/api';

// Individual menu category button component
const MenuCategoryButton = ({ category, onCategoryClick }) => {
    const handleClick = () => {
        onCategoryClick(category);
    };
    
    return (
        <button 
            className="menu-category-button"
            onClick={handleClick}
        >
            {category.name}
        </button>
    )
}

// Main MenuItems component
const MenuItems = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch(`${API_BASE_URL}/menu/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            // Sort categories by displayOrder if available, otherwise by name
            const sortedCategories = data.sort((a, b) => {
                if (a.displayOrder !== null && b.displayOrder !== null) {
                    return a.displayOrder - b.displayOrder;
                }
                if (a.displayOrder !== null) return -1;
                if (b.displayOrder !== null) return 1;
                return a.name.localeCompare(b.name);
            });
            setCategories(sortedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load menu categories');
        } finally {
            setLoading(false);
        }
    };

    const scrollToCategory = (category) => {
        // Convert category name to section ID (lowercase, replace spaces with hyphens)
        const sectionId = category.name.toLowerCase().replace(/\s+/g, '-');
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <div className="menu-items">
            <h2>Our Menu</h2>
            {loading ? (
                <div>Loading categories...</div>
            ) : error ? (
                <div className="error-message">{error}</div>
            ) : categories.length === 0 ? (
                <div>No categories found</div>
            ) : (
                categories.map((category) => (
                    <MenuCategoryButton 
                        key={category.categoryId}
                        category={category}
                        onCategoryClick={scrollToCategory}
                    />
                ))
            )}
        </div>
    )
}

export default MenuItems;