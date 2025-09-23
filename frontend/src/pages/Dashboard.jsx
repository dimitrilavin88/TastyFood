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
                {user.username === "admin" ? (
                    <>
                        <h1>Admin Panel</h1>
                        <div className="admin-dashboard-buttons">
                            <button>Manage Staff</button>
                            <button>Manage Drivers</button>
                            <button>Change Password</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Welcome, {user.name}!</h1>
                        <div className="dashboard-buttons">
                            <button>Retrieve Order</button>
                            <button>Assign Driver</button>
                            <button>Record Delivery</button>
                            <button>Change Password</button>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}

export default Dashboard;