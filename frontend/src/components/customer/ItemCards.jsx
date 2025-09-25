import React, { useState } from 'react';

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
            // Extract numeric price from string (e.g., "$12.99" -> 12.99)
            const price = parseFloat(item.price.replace('$', ''));
            console.log('Calling addToCart with:', { name: item.name, quantity, price }); // Debug log
            window.addToCart(item.name, quantity, price);
            // Reset quantity after adding
            setQuantities(prev => ({
                ...prev,
                [item.name]: 0
            }));
        } else {
            console.error('window.addToCart function not found!'); // Debug log
        }
    };

    return (
        <div className="item-cards">
            {items.map((item, index) => (
                <div className="item-card" key={index}>
                    <img src={item.image} alt={item.name} className="item-image"/>
                    <h3>{item.name} - {item.price}</h3>
                    <p>{item.description}</p>
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

const Items = () => {
    const appetizers = [{
        name: "Mozzarella Sticks",
        description: "Golden crispy breaded mozzarella sticks served with marinara sauce. Perfect starter to share!",
        price: "$8.99",
        image: "https://static01.nyt.com/images/2024/02/08/multimedia/ND-mozzarella-sticks-pvfm/ND-mozzarella-sticks-pvfm-mediumSquareAt3X.jpg"
    },
    {
        name: "Chicken Wings",
        description: "Tender chicken wings tossed in your choice of buffalo, BBQ, or honey garlic sauce. Served with celery and ranch.",
        price: "$12.99",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop&auto=format"
    },
    {
        name: "Fried Pickles",
        description: "Crispy dill pickles breaded and fried to perfection. Served with creamy ranch dipping sauce.",
        price: "$6.99",
        image: "https://popmenucloud.com/cdn-cgi/image/width%3D1200%2Cheight%3D1200%2Cfit%3Dscale-down%2Cformat%3Dauto%2Cquality%3D60/kjivbcex/62ad593b-166e-44db-9177-e04e982bcd22.jpg"
    },
    {
        name: "Onion Rings",
        description: "Thick-cut onion rings with crispy golden batter. Perfectly seasoned and served hot.",
        price: "$7.99",
        image: "data:image/jpeg;base64,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"
    }];

    const mainCourses = [{
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon grilled to perfection with lemon herb butter. Served with seasonal vegetables and rice.",
        price: "$22.99",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop"
    },
    {
        name: "Chicken Parmesan",
        description: "Breaded chicken breast topped with marinara sauce and melted mozzarella. Served with spaghetti and garlic bread.",
        price: "$18.99",
        image: "https://tastesbetterfromscratch.com/wp-content/uploads/2023/03/Chicken-Parmesan-1.jpg"
    },
    {
        name: "Beef Lasagna",
        description: "Layers of pasta, seasoned ground beef, ricotta cheese, and mozzarella baked with our signature marinara sauce.",
        price: "$16.99",
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&auto=format"
    },
    {
        name: "Vegetable Stir-Fry",
        description: "Fresh seasonal vegetables stir-fried in a savory garlic sauce. Served over jasmine rice. Vegan option available.",
        price: "$14.99",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop"
    }];

    const desserts = [{
        name: "Cheesecake",
        description: "Rich and creamy New York style cheesecake with a graham cracker crust. Topped with fresh berries.",
        price: "$7.99",
        image: "https://therecipecritic.com/wp-content/uploads/2021/04/newyorkcheesecake.jpg"
    },
    {
        name: "Ice Cream",
        description: "Three scoops of premium ice cream in vanilla, chocolate, or strawberry. Add toppings for $1 each.",
        price: "$5.99",
        image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop"
    },
    {
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten chocolate center. Served with vanilla ice cream and fresh berries.",
        price: "$8.99",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
    },
    {
        name: "Fruit Salad",
        description: "Fresh seasonal fruits including strawberries, melons, grapes, and citrus. Light and refreshing.",
        price: "$6.99",
        image: "https://popmenucloud.com/cdn-cgi/image/width=1920,height=1920,format=auto,fit=scale-down/beupinso/0aa33bdd-ecf6-4e24-8331-9ce22399ef24.png"
    }];

    const beverages = [{
        name: "Soda",
        description: "Your choice of Coca-Cola, Pepsi, Sprite, or Dr. Pepper. Served with ice.",
        price: "$2.99",
        image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop"
    },
    {
        name: "Water",
        description: "Fresh filtered water served with lemon. Free refills available.",
        price: "$1.99",
        image: "https://www.phillymag.com/wp-content/uploads/sites/3/2020/02/water-9x6-1.jpg"
    },
    {
        name: "Coffee",
        description: "Freshly brewed premium coffee. Choose from regular, decaf, or flavored options.",
        price: "$3.99",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
    },
    {
        name: "Tea",
        description: "Selection of hot or iced teas including black, green, herbal, and fruit varieties.",
        price: "$3.49",
        image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop"
    }];

    return (
        <div className="items">
            <h2 id="appetizers">Appetizers</h2>
            <ItemCards items={appetizers} />
            <h2 id="main-courses">Main Courses</h2>
            <ItemCards items={mainCourses} />
            <h2 id="desserts">Desserts</h2>
            <ItemCards items={desserts} />
            <h2 id="beverages">Beverages</h2>
            <ItemCards items={beverages} />
        </div>
    )
}

export default Items;