import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import MenuItems from '../components/customer/MenuItems';

const Menu = () => {
    return (
        <div className="menu-page">
            <Header />
            <main className="main">
                <aside className="menu-items"><MenuItems /></aside>
                <div className="container">
                    <h1>Welcome to Our Menu</h1>
                    <p>Select a category from the sidebar to view our delicious offerings!</p>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Menu;