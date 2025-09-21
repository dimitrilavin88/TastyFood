import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import MenuItems from '../components/customer/MenuItems';

const Menu = () => {
    return (
        <div className="app">
            <Header />
            <main className="main">
                <MenuItems />
            </main>
            <Footer />
        </div>
    )
}

export default Menu;