import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth } from '../utils/auth.jsx';
import generatePassword from '../utils/GeneratePassword.jsx';
import { API_BASE_URL } from '../config/api.js';

const ManageStaff = () => {
    const {user} = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [staffUsers, setStaffUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState('');

    // Fetch employees from backend
    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setFetchError('');
            const response = await fetch(`${API_BASE_URL}/employees`);
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            const data = await response.json();
            setStaffUsers(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setFetchError('Failed to load staff members. Please try again.');
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

        const password = generatePassword();
        
        try {
            // Register employee via API (this will generate username and create both employee and credentials)
            const response = await fetch(`${API_BASE_URL}/employees/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
            password: password,
                    role: 'STAFF'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register employee');
            }

            const result = await response.json();
            const username = result.username;

            // Refresh the employee list
            await fetchEmployees();
            
            // Show success message with credentials
            alert(`Staff member added successfully!\nUsername: ${username}\nPassword: ${password}\n\nPlease save these credentials.`);
        
        // Clear the form
        setFirstName('');
        setLastName('');
        } catch (error) {
            console.error('Error creating employee:', error);
            setErrorMessage(error.message || 'Failed to add staff member. Please try again.');
        }
    }

    const handleDelete = async (username) => {
        const employee = staffUsers.find(emp => emp.username === username);
        if (!employee) return;

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${employee.firstName} ${employee.lastName}? This action cannot be undone.`
        );
        
        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/employees/${username}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            // Refresh the employee list
            await fetchEmployees();
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete staff member. Please try again.');
        }
    }

    return (
        <div className="manage-staff-page">
            <Header />
            <main className="main">
                <h1>Manage Staff Accounts</h1>
                <div className="manage-staff-content">
                    <div className="name-entry">
                        <form id="staff-entry-form" onSubmit={handleSubmit}>
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
                            <button type="submit">Add Staff</button>
                        </form>
                    </div>
                    <div className="staff-list">
                        {fetchError && <div className="error-message">{fetchError}</div>}
                        {loading ? (
                            <div>Loading staff members...</div>
                        ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                        <th>Username</th>
                                        <th>Role</th>
                                    <th>Active</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                                <tbody>
                                    {staffUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" style={{ textAlign: 'center' }}>
                                                No staff members found
                                            </td>
                                        </tr>
                                    ) : (
                                        staffUsers.map((staffUser) => (
                                            <tr key={staffUser.username}>
                                                <td>{staffUser.firstName}</td>
                                                <td>{staffUser.lastName}</td>
                                                <td>{staffUser.username}</td>
                                                <td>{staffUser.role}</td>
                                                <td>{staffUser.activeStatus ? 'Yes' : 'No'}</td>
                                        <td>
                                                    {staffUser.username.toLowerCase() !== 'admin' ? (
                                            <button 
                                                            onClick={() => handleDelete(staffUser.username)}
                                            >
                                                Delete
                                            </button>
                                                    ) : (
                                                        <span style={{ color: '#999', fontStyle: 'italic' }}>N/A</span>
                                                    )}
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

export default ManageStaff;