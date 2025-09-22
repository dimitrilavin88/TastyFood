import React, { useState } from 'react';

const ItemCards = ({ items }) => {
    const [quantity, setQuantity] = useState(0);

    return (
        <div className="item-cards">
            {items.map((item, index) => (
                <div className="item-card" key={index}>
                    <img src={item.image} alt={item.name} className="item-image"/>
                    <h3>{item.name} - {item.price}</h3>
                    <p>{item.description}</p>
                    <div className="item-card-quantity">
                        <input type="number" placeholder="Quantity" />
                    </div>
                    <button>Add to Cart</button>
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
        image: "https://img.freepik.com/free-psd/crispy-onion-rings-with-ketchup_632498-24134.jpg"
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
            <h2>Appetizers</h2>
            <ItemCards items={appetizers} />
            <h2>Main Courses</h2>
            <ItemCards items={mainCourses} />
            <h2>Desserts</h2>
            <ItemCards items={desserts} />
            <h2>Beverages</h2>
            <ItemCards items={beverages} />
        </div>
    )
}

export default Items;