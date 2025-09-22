import React, { useState } from 'react';
import Header from '../components/common/header';
import Footer from '../components/common/Footer';
import { validateLogin, validateUsername, validatePassword } from '../utils/auth';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
        const result = validateLogin(username, password);
        
        if (result.success) {
            setErrorMessage('');
            alert(`Welcome, ${result.user.name}!`);
            // Here you would typically redirect or set authentication state
        } else {
            setErrorMessage(result.message);
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
                        <button type="submit" disabled={isButtonDisabled()} onClick={handleSubmit}>Login</button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Login;