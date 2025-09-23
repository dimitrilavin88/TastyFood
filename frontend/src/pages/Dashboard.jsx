import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useAuth } from '../utils/auth.jsx';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const goToManageStaff = () => {
        if (user.username === "admin") {
            navigate('/manage-staff');
        } else {
            navigate('/login');
        }
    }

    return (
        <div className="dashboard-page">
            <Header />
            <main className="main">
                {user.username === "admin" ? (
                    <>
                        <h1>Admin Panel</h1>
                        <div className="admin-dashboard-buttons">
                            <button onClick={goToManageStaff}>Manage Staff</button>
                            <button>Manage Drivers</button>
                            <button>Change Password</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Welcome, {user.first_name}!</h1>
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