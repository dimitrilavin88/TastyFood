import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useAuth, validatePassword } from '../utils/auth.jsx';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api.js';

const ChangePassword = () => {
    const { user } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Validation function for change password (client-side validation only)
    const validateChangePassword = (oldPass, newPass, confirmPass) => {
        if (!oldPass || oldPass.trim() === '') {
            return { success: false, message: 'Old password is required' };
        }
        
        const newPassResult = validatePassword(newPass);
        if (!newPassResult.success) {
            return { success: false, message: newPassResult.message };
        }
        
        if (newPass !== confirmPass) {
            return { success: false, message: 'New password and confirm password do not match' };
        }
        
        if (oldPass === newPass) {
            return { success: false, message: 'New password must be different from old password' };
        }
        
        return { success: true };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
        const result = validateChangePassword(oldPassword, newPassword, confirmPassword);
        if (!result.success) {
            setErrorMessage(result.message);
            return;
        }
        
        // Check if user is logged in
        if (!user || !user.username) {
            setErrorMessage('You must be logged in to change your password');
            return;
        }
        
        setErrorMessage('');
        setIsLoading(true);
        
        try {
            // Call backend API to change password
            const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: user.username,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                })
            });
            
            if (!response.ok) {
                // Handle non-200 responses
                const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                setErrorMessage(errorData.message || `Server error: ${response.status}`);
                return;
            }
            
            const data = await response.json();
            
            if (data.success) {
                // Password changed successfully
                setErrorMessage('');
                alert('Password changed successfully!');
                navigate('/dashboard');
            } else {
                setErrorMessage(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Change password error:', error);
            if (error.message && error.message.includes('fetch')) {
                setErrorMessage('Failed to connect to server. Please make sure the backend is running on http://localhost:8080');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    const isButtonDisabled = () => {
        return !(oldPassword.trim() && newPassword.trim() && confirmPassword.trim());
    }
    return (
        <div className="change-password-page">
            <Header />
            <main className="main">
                <h1>Change Password</h1>
                <div className="change-password-content">
                    <form id="change-password-form" onSubmit={handleSubmit}>
                        <label htmlFor="oldPassword">Old Password</label>
                        <input 
                            type="password" 
                            id="oldPassword" 
                            name="oldPassword" 
                            value={oldPassword} 
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <label htmlFor="newPassword">New Password</label>
                        <input 
                            type="password" 
                            id="newPassword" 
                            name="newPassword" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)} 
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                        />
                        <button type="submit" disabled={isButtonDisabled() || isLoading}>
                            {isLoading ? 'Changing Password...' : 'Change Password'}
                        </button>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </form>
                </div>
            </main>
        </div>
    )
}

export default ChangePassword;