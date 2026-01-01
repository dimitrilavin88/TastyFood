import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { validateUsername, validatePassword, useAuth } from '../utils/auth.jsx';
import { API_BASE_URL } from '../config/api.js';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const isButtonDisabled = () => {
        const usernameResult = validateUsername(username);
        const passwordResult = validatePassword(password);
        return !(usernameResult.success && passwordResult.success);
    }

    const validateAndSetError = (fieldType) => {
        if (fieldType === 'username') {
            const usernameResult = validateUsername(username);
            if (!usernameResult.success) {
                setErrorMessage(usernameResult.message);
            } else {
                setErrorMessage('');
            }
        } else if (fieldType === 'password') {
            const passwordResult = validatePassword(password);
            if (!passwordResult.success) {
                setErrorMessage(passwordResult.message);
            } else {
                setErrorMessage('');
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission
        
        // Validate input format first
        const usernameResult = validateUsername(username);
        const passwordResult = validatePassword(password);
        
        if (!usernameResult.success) {
            setErrorMessage(usernameResult.message);
            return;
        }
        
        if (!passwordResult.success) {
            setErrorMessage(passwordResult.message);
            return;
        }
        
        // Clear any previous error messages
            setErrorMessage('');
        setIsLoading(true);
        
        try {
            // Call backend API to authenticate
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password: password
                })
            });
            
            if (!response.ok) {
                // Handle non-200 responses
                const errorData = await response.json().catch(() => ({ message: 'Server error' }));
                setErrorMessage(errorData.message || `Server error: ${response.status}`);
                return;
            }
            
            const data = await response.json();
            console.log('Login response:', data);
            
            if (data.success) {
                // Set the user in the auth context with data from backend
                login({
                    username: data.username,
                    first_name: data.first_name || '',
                    last_name: data.last_name || '',
                    role: data.role || 'staff'
                });
            // Redirect to dashboard
            navigate('/dashboard');
        } else {
                setErrorMessage(data.message || 'Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.message && error.message.includes('fetch')) {
                setErrorMessage('Failed to connect to server. Please make sure the backend is running on http://localhost:8080');
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-page">
            <Header />
            <main className="main">
                <div className="login-card">
                    <h1>Employee Login</h1>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            value={username} 
                            onChange={(e) => {
                                setUsername(e.target.value);
                                validateAndSetError('username');
                            }}
                        />
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => {
                                setPassword(e.target.value);
                                validateAndSetError('password');
                            }}
                        />
                        <button type="submit" disabled={isButtonDisabled() || isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Login;