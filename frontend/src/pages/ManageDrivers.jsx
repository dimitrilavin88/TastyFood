import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useAuth, DRIVERS } from '../utils/auth.jsx';
import generatePassword from '../utils/GeneratePassword.jsx';

const ManageDrivers = () => {
    const {user} = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [drivers, setDrivers] = useState(DRIVERS);

    // Validation functions
    const validateFirstName = (name) => {
        if (!name || name.trim() === '') {
            return { success: false, message: 'First name is required' };
        }
        if (name.length < 2) {
            return { success: false, message: 'First name must be at least 2 characters' };
        }
        return { success: true };
    };

    const validateLastName = (name) => {
        if (!name || name.trim() === '') {
            return { success: false, message: 'Last name is required' };
        }
        if (name.length < 2) {
            return { success: false, message: 'Last name must be at least 2 characters' };
        }
        return { success: true };
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate both fields before submission
        const firstNameResult = validateFirstName(firstName);
        const lastNameResult = validateLastName(lastName);

        if (!firstNameResult.success) {
            setErrorMessage(firstNameResult.message);
            return;
        }

        if (!lastNameResult.success) {
            setErrorMessage(lastNameResult.message);
            return;
        }

        // Clear any error messages
        setErrorMessage('');

        const isActive = true;
        
        // Create new driver user object
        const newDriver = {
            first_name: firstName,
            last_name: lastName,
            active: isActive
        };
        
        // Add new user to the driver list
        setDrivers(prevDrivers => [...prevDrivers, newDriver]);
        
        console.log('New driver added:', newDriver);
        console.log('Updated driver list:', [...drivers, newDriver]);
        
        // Clear the form
        setFirstName('');
        setLastName('');
    }

    return (
        <div className="manage-driver-page">
            <Header />
            <main className="main">
                <h1>Manage Driver Accounts</h1>
                <div className="manage-driver-content">
                    <div className="name-entry">
                        <form id="driver-entry-form" onSubmit={handleSubmit}>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                type="text" 
                                id="firstName" 
                                name="firstName" 
                                placeholder="Enter first name" 
                                onChange={(e) => {
                                    const result = validateFirstName(e.target.value);
                                    if (!result.success) {
                                        setErrorMessage(result.message);
                                    } else {
                                        setErrorMessage('');
                                    }
                                    setFirstName(e.target.value);
                                }}
                                value={firstName}
                            />
                            <label htmlFor="lastName">Last Name</label>
                            <input 
                                type="text" 
                                id="lastName" 
                                name="lastName" 
                                placeholder="Enter last name" 
                                onChange={(e) => {
                                    const result = validateLastName(e.target.value);
                                    if (!result.success) {
                                        setErrorMessage(result.message);
                                    } else {
                                        setErrorMessage('');
                                    }
                                    setLastName(e.target.value);
                                }}
                                value={lastName}
                            />
                            <button type="submit">Hire Driver</button>
                        </form>
                    </div>
                    <div className="driver-list">
                        <table>
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {drivers.map((driver, index) => (
                                    <tr key={index}>
                                        <td>{driver.first_name}</td>
                                        <td>{driver.last_name}</td>
                                        <td>Yes</td>
                                        <td>
                                            <button 
                                                onClick={() => {
                                                    const confirmDelete = window.confirm(
                                                        `Are you sure you want to fire ${driver.first_name} ${driver.last_name}? This action cannot be undone.`
                                                    );
                                                    
                                                    if (confirmDelete) {
                                                        // Remove the user from the driver list
                                                            setDrivers(prevDrivers => 
                                                            prevDrivers.filter((_, userIndex) => userIndex !== index)
                                                        );
                                                        console.log(`Deleted driver: ${driver.first_name} ${driver.last_name}`);
                                                    } else {
                                                        console.log('Delete cancelled');
                                                    }
                                                }}
                                            >
                                                Fire
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default ManageDrivers;