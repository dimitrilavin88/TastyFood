import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { useAuth, validatePassword } from '../utils/auth.jsx';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const { user } = useAuth();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    // Validation function for change password
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

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = validateChangePassword(oldPassword, newPassword, confirmPassword);
        if (result.success) {
            setErrorMessage('');
            console.log('Password changed successfully');
            // In a real app, you would update the password here
            navigate('/dashboard');
        } else {
            setErrorMessage(result.message);
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
                        <button type="submit" disabled={isButtonDisabled()}>Change Password</button>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                    </form>
                </div>
            </main>
        </div>
    )
}

export default ChangePassword;