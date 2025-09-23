import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useAuth, STAFF_USERS } from '../utils/auth.jsx';
import generatePassword from '../utils/GeneratePassword.jsx';

const ManageStaff = () => {
    const {user} = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [staffUsers, setStaffUsers] = useState(STAFF_USERS);

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

        const username = (user?.name || 'user') + Math.floor(Math.random() * 1000);
        const password = generatePassword();
        
        // Create new staff user object
        const newStaffUser = {
            username: username,
            password: password,
            first_name: firstName,
            last_name: lastName
        };
        
        // Add new user to the staff users list
        setStaffUsers(prevStaffUsers => [...prevStaffUsers, newStaffUser]);
        
        console.log('New staff member added:', newStaffUser);
        console.log('Updated staff list:', [...staffUsers, newStaffUser]);
        
        // Clear the form
        setFirstName('');
        setLastName('');
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
                                    {staffUsers.map((staffUser, index) => (
                                    <tr key={index}>
                                        <td>{staffUser.first_name}</td>
                                        <td>{staffUser.last_name}</td>
                                        <td>Yes</td>
                                        <td>
                                            <button 
                                                onClick={() => {
                                                    const confirmDelete = window.confirm(
                                                        `Are you sure you want to delete ${staffUser.first_name} ${staffUser.last_name}? This action cannot be undone.`
                                                    );
                                                    
                                                    if (confirmDelete) {
                                                        // Remove the user from the staff users list
                                                        setStaffUsers(prevStaffUsers => 
                                                            prevStaffUsers.filter((_, userIndex) => userIndex !== index)
                                                        );
                                                        console.log(`Deleted user: ${staffUser.first_name} ${staffUser.last_name} (${staffUser.username})`);
                                                    } else {
                                                        console.log('Delete cancelled');
                                                    }
                                                }}
                                            >
                                                Delete
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

export default ManageStaff;