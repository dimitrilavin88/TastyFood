import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../utils/auth.jsx';
import { API_BASE_URL } from '../config/api.js';

const ManageDrivers = () => {
    const {user} = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    // Fetch drivers from backend
    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            setLoading(true);
            setFetchError('');
            const response = await fetch(`${API_BASE_URL}/drivers`);
            if (!response.ok) {
                throw new Error('Failed to fetch drivers');
            }
            const data = await response.json();
            setDrivers(data);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            setFetchError('Failed to load drivers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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

    const handleSubmit = async (e) => {
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

        try {
            // Create driver via API
            const response = await fetch(`${API_BASE_URL}/drivers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName.trim(),
                    lastName: lastName.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create driver');
            }

            // Refresh the driver list
            await fetchDrivers();
            
            // Show success message
            alert(`Driver hired successfully!`);
        
        // Clear the form
        setFirstName('');
        setLastName('');
        } catch (error) {
            console.error('Error creating driver:', error);
            setErrorMessage(error.message || 'Failed to add driver. Please try again.');
        }
    }

    const handleDelete = async (driverId) => {
        const driver = drivers.find(d => d.driverId === driverId);
        if (!driver) return;

        // Extract first and last name from fullName
        const nameParts = driver.fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        const confirmDelete = window.confirm(
            `Are you sure you want to fire ${driver.fullName}? This action cannot be undone.`
        );
        
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete driver');
            }

            // Refresh the driver list
            await fetchDrivers();
        } catch (error) {
            console.error('Error deleting driver:', error);
            alert('Failed to fire driver. Please try again.');
        }
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
                        {fetchError && <div className="error-message">{fetchError}</div>}
                        {loading ? (
                            <div>Loading drivers...</div>
                        ) : (
                        <table>
                            <thead>
                                <tr>
                                        <th>Full Name</th>
                                        <th>On Delivery</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {drivers.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>
                                                No drivers found
                                            </td>
                                        </tr>
                                    ) : (
                                        drivers.map((driver) => (
                                            <tr key={driver.driverId}>
                                                <td>{driver.fullName}</td>
                                                <td>{driver.onDelivery ? 'Yes' : 'No'}</td>
                                        <td>
                                            <button 
                                                        onClick={() => handleDelete(driver.driverId)}
                                            >
                                                Fire
                                            </button>
                                        </td>
                                    </tr>
                                        ))
                                    )}
                            </tbody>
                        </table>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default ManageDrivers;