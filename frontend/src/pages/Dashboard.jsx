import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { STAFF_USERS, useAuth } from '../utils/auth.jsx';
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

    const goToManageDrivers = () => {
        if (user.username === "admin") {
            navigate('/manage-drivers');
        } else {
            navigate('/login');
        }
    }

    const goToRetrieveOrder = () => {
        if (STAFF_USERS.some(user => user.username === user.username)) {
        navigate('/retrieve-order');
    } else {
        navigate('/login');
        }
    }

    const goToRecordDelivery = () => {
        if (STAFF_USERS.some(user => user.username === user.username)) {
            navigate('/record-delivery');
        } else {
            navigate('/login');
        }
    }

    const goToChangePassword = () => {
        if (user.username === "admin" || STAFF_USERS.some(user => user.username === user.username)) {
            navigate('/change-password');
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
                            <button onClick={goToManageDrivers}>Manage Drivers</button>
                            <button onClick={goToChangePassword}>Change Password</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>Welcome, {user.first_name}!</h1>
                        <div className="dashboard-buttons">
                            <button onClick={goToRetrieveOrder}>Retrieve Order</button>
                            <button onClick={goToRecordDelivery}>Record Delivery</button>
                            <button onClick={goToChangePassword}>Change Password</button>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    )
}

export default Dashboard;