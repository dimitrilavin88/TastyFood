import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useAuth } from '../utils/auth.jsx';

const Dashboard = () => {
    const { user } = useAuth();
    return (
        <div className="dashboard-page">
            <Header />
            <main className="main">
                <h1>Welcome, {user.name}!</h1>
            </main>
            <Footer />
        </div>
    )
}

export default Dashboard;