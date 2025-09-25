import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import MenuItems from '../components/customer/MenuItems';
import Items from '../components/customer/ItemCards';
import CheckoutItems from '../components/customer/CheckoutItems';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';


const Menu = () => {
    const [searchParams] = useSearchParams();
    
    useEffect(() => {
        // Check if there's a section parameter in the URL
        const section = searchParams.get('section');
        if (section) {
            // Wait for the component to render, then scroll to the section
            setTimeout(() => {
                const element = document.getElementById(section);
                if (element) {
                    element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100); // Small delay to ensure the page has rendered
        }
    }, [searchParams]);

    return (
        <div className="menu-page">
            <Header />
            <main className="main">
                <aside className="menu-items"><MenuItems /></aside>
                <div className="container">
                    <h1>Welcome to Our Menu</h1>
                    <p>Select a category from the sidebar to view our delicious offerings!</p>
                    <Items />
                </div>
                <CheckoutItems />
            </main>
            <Footer />
        </div>
    )
}

export default Menu;