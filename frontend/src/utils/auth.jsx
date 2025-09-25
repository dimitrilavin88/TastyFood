import React, { useState } from 'react';
import { createContext, useContext } from 'react';

export const AuthContext = createContext();

// Staff authentication utility
// This file handles user verification for staff login

// Sample staff users database
// In a real application, this would be fetched from a backend API
export const STAFF_USERS = [
  {
    username: 'admin',
    password: 'Admin123',
    first_name: 'Admin',
    last_name: 'User'
  },
  {
    username: 'manager00',
    password: 'Manager123',
    first_name: 'Dimitri',
    last_name: 'Lavin'
  }
];

// Sample drivers database
export const DRIVERS = [
  {
    first_name: 'John',
    last_name: 'Smith',
    active: true
  },
  {
    first_name: 'Sarah',
    last_name: 'Johnson',
    active: true
  }
];

/**
 * Verify if a user exists in the staff database
 * @param {string} username - The username to check
 * @returns {boolean} - True if user exists, false otherwise
 */
export const userExists = (username) => {
  return STAFF_USERS.some(user => user.username === username);
};

/**
 * Authenticate a user with username and password
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {object|null} - User object if authenticated, null if not
 */
export const authenticateUser = (username, password) => {
  const user = STAFF_USERS.find(user => 
    user.username === username && user.password === password
  );
  
  if (user) {
    // Return user data without password for security
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};

/**
 * Get user by username
 * @param {string} username - The username
 * @returns {object|null} - User object if found, null if not
 */
export const getUserByUsername = (username) => {
  const user = STAFF_USERS.find(user => user.username === username);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
};

/**
 * Get all staff users (without passwords)
 * @returns {Array} - Array of user objects without passwords
 */
export const getAllStaffUsers = () => {
  return STAFF_USERS.map(user => {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
};

/**
 * Check if user has specific role
 * @param {string} username - The username
 * @param {string} role - The role to check (manager, chef, server)
 * @returns {boolean} - True if user has the role, false otherwise
 */
export const hasRole = (username, role) => {
  const user = STAFF_USERS.find(user => user.username === username);
  return user && user.role === role;
};

/**
 * Validate login credentials
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {object} - Result object with success status and user data or error message
 */
export const validateLogin = (username, password) => {
  // Check if username is provided
  if (!username || username.trim() === '') {
    return {
      success: false,
      message: 'Username is required'
    };
  }
  
  // Check if password is provided
  if (!password || password.trim() === '') {
    return {
      success: false,
      message: 'Password is required'
    };
  }
  
  // Check if user exists
  if (!userExists(username)) {
    return {
      success: false,
      message: 'User not found'
    };
  }
  
  // Try to authenticate
  const user = authenticateUser(username, password);
  
  if (user) {
    return {
      success: true,
      message: 'Login successful',
      user: user
    };
  } else {
    return {
      success: false,
      message: 'Invalid password'
    };
  }
};

export const validateUsername = (username) => {
  if (username === 'admin') {
    return {
      success: true,
      message: ''
    };
  }
  else if (!/^[a-zA-Z]{2,}\d{2}$/.test(username)) {
    return {
      success: false,
      message: 'Username needs to be atleast 2 letters and 2 numbers at the end'
    };
  }
  return {
    success: true,
    message: 'Username is valid'
  };
}

export const validatePassword = (password) => {
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password)) {
    return {
      success: false,
      message: 'Password needs to have atleast 6 characters, at least one uppercase letter, one lowercase letter, and at least one number'
    };
  }
  return {
    success: true,
    message: 'Password is valid'
  };
}

/**
 * Verify if the provided old password matches the current user's password
 * @param {string} username - The username of the current user
 * @param {string} oldPassword - The old password to verify
 * @returns {object} - Result object with success status and message
 */
export const verifyOldPassword = (username, oldPassword) => {
  const user = STAFF_USERS.find(user => user.username === username);
  
  if (!user) {
    return {
      success: false,
      message: 'User not found'
    };
  }
  
  if (user.password === oldPassword) {
    return {
      success: true,
      message: 'Old password is correct'
    };
  } else {
    return {
      success: false,
      message: 'The password you entered is not your current password'
    };
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [staffUsers, setStaffUsers] = useState(STAFF_USERS);
  const login = (user) => setUser(user);
  const logout = () => setUser(null);

  const addStaffUser = (user) => {
    setStaffUsers([...staffUsers, user]);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
  );
}

export const validateFirstName = (name) => {
  if (!/^[a-zA-Z]{2,}$/.test(name)) {
    return {
      success: false,
      message: 'Name needs to be atleast 2 letters'
    };
  }
  return {
    success: true,
    message: 'Name is valid'
  };
}
export const validateLastName = (name) => {
  if (!/^[a-zA-Z]{2,}$/.test(name)) {
    return {
      success: false,
      message: 'Last name needs to be atleast 2 letters'
    };
  }
  return {
    success: true,
    message: 'Last name is valid'
  };
}

export const useAuth = () => {
  return useContext(AuthContext);
}

// Default export for easy importing
export default {
  userExists,
  authenticateUser,
  getUserByUsername,
  getAllStaffUsers,
  hasRole,
  validateLogin,
  validateUsername,
  validatePassword,
  verifyOldPassword,
  validateFirstName,
  validateLastName,
  AuthProvider,
  useAuth
};
