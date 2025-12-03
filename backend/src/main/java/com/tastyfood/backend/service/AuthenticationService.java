package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceLoginCredentials;
import com.tastyfood.backend.dbinterface.DBInterfaceEmployees;
import com.tastyfood.backend.domain.Employee;
import com.tastyfood.backend.domain.LoginCredentials;
import com.tastyfood.backend.enums.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthenticationService {
    
    @Autowired
    private DBInterfaceLoginCredentials dbInterface;
    
    @Autowired
    private DBInterfaceEmployees employeeDbInterface;
    
    public boolean authenticate(String username, String password) {
        Optional<LoginCredentials> credentials = dbInterface.findByUsername(username);
        if (credentials.isEmpty()) {
            return false;
        }
        
        String storedHash = credentials.get().getPasswordHash();
        
        // Try hashed password first (SHA-256 + Base64)
        String hashedPassword = hashPassword(password);
        if (hashedPassword.equals(storedHash)) {
            return true;
        }
        
        // Fallback: check if stored password is plain text (for migration purposes)
        if (password.equals(storedHash)) {
            // If plain text matches, update to hashed version for security
            credentials.get().setPasswordHash(hashedPassword);
            dbInterface.save(credentials.get());
            return true;
        }
        
        return false;
    }
    
    /**
     * Authenticates a user and returns the employee information if successful.
     * For admin users who may not be in the employees table, returns a minimal employee object.
     * 
     * @param username The username
     * @param password The password
     * @return Optional containing Employee if authentication succeeds, empty otherwise
     */
    public Optional<Employee> authenticateAndGetEmployee(String username, String password) {
        if (!authenticate(username, password)) {
            return Optional.empty();
        }
        
        // Try to get employee information
        Optional<Employee> employeeOpt = employeeDbInterface.findByUsername(username);
        
        // If employee exists in employees table, return it
        if (employeeOpt.isPresent()) {
            return employeeOpt;
        }
        
        // For admin or other users not in employees table, check login_credentials for userType
        Optional<LoginCredentials> credentialsOpt = dbInterface.findByUsername(username);
        if (credentialsOpt.isPresent()) {
            LoginCredentials credentials = credentialsOpt.get();
            // Create a minimal employee object for admin users
            Employee adminEmployee = new Employee();
            adminEmployee.setUsername(username);
            // Set name based on username - if it's "admin", use "Admin User", otherwise try to infer from username
            if (username.equalsIgnoreCase("admin")) {
                adminEmployee.setFirstName("Admin");
                adminEmployee.setLastName("User");
            } else {
                // For other users, try to split username or use defaults
                adminEmployee.setFirstName(username.substring(0, 1).toUpperCase() + username.substring(1));
                adminEmployee.setLastName("");
            }
            // Try to determine role from userType in login_credentials
            String userType = credentials.getUserType();
            if (userType != null && userType.equalsIgnoreCase("admin")) {
                adminEmployee.setRole(UserType.ADMIN);
            } else {
                adminEmployee.setRole(UserType.STAFF);
            }
            adminEmployee.setActiveStatus(true);
            return Optional.of(adminEmployee);
        }
        
        return Optional.empty();
    }
    
    public boolean createCredentials(String username, String password) {
        if (dbInterface.existsByUsername(username)) {
            return false; // Username already exists
        }
        
        String hashedPassword = hashPassword(password);
        LoginCredentials credentials = new LoginCredentials();
        credentials.setUsername(username);
        credentials.setPasswordHash(hashedPassword);
        credentials.setUserType("staff"); // Default to staff
        
        dbInterface.save(credentials);
        return true;
    }
    
    public boolean updatePassword(String username, String newPassword) {
        Optional<LoginCredentials> credentials = dbInterface.findByUsername(username);
        if (credentials.isEmpty()) {
            return false;
        }
        
        String hashedPassword = hashPassword(newPassword);
        credentials.get().setPasswordHash(hashedPassword);
        dbInterface.save(credentials.get());
        return true;
    }
    
    /**
     * Updates a user's password after verifying the old password.
     * 
     * @param username The username
     * @param oldPassword The current password (to verify)
     * @param newPassword The new password to set
     * @return true if password was updated successfully, false if old password is incorrect or user not found
     */
    public boolean changePassword(String username, String oldPassword, String newPassword) {
        // First verify the old password
        if (!authenticate(username, oldPassword)) {
            return false; // Old password is incorrect
        }
        
        // If old password is correct, update to new password
        return updatePassword(username, newPassword);
    }
    
    /**
     * Registers a new employee by generating a username based on last name
     * and creating both employee record and login credentials.
     * 
     * @param firstName First name of the employee
     * @param lastName Last name of the employee (used for username generation)
     * @param password Password for the employee
     * @param userType User type ('admin' or 'staff') - defaults to 'staff' if null
     * @return Generated username, or null if registration failed
     */
    public String registerEmployee(String firstName, String lastName, String password, String userType) {
        // Generate username: lastname (lowercase) + two random numbers
        String baseUsername = lastName.toLowerCase().replaceAll("[^a-z0-9]", "");
        String username = generateUniqueUsername(baseUsername);
        
        if (username == null) {
            return null; // Could not generate unique username
        }
        
        // Create login credentials
        String hashedPassword = hashPassword(password);
        LoginCredentials credentials = new LoginCredentials();
        credentials.setUsername(username);
        credentials.setPasswordHash(hashedPassword);
        credentials.setUserType(userType != null ? userType.toLowerCase() : "staff");
        dbInterface.save(credentials);
        
        return username;
    }
    
    /**
     * Generates a unique username based on the base name.
     * Format: basename + two-digit number (00-99)
     * 
     * @param baseName Base name for the username (typically last name)
     * @return Unique username, or null if all combinations are taken
     */
    private String generateUniqueUsername(String baseName) {
        Random random = new Random();
        int maxAttempts = 100; // Try up to 100 different number combinations
        
        for (int attempt = 0; attempt < maxAttempts; attempt++) {
            // Generate two random digits (00-99)
            int number = random.nextInt(100);
            String username = baseName + String.format("%02d", number);
            
            // Check if username already exists in employees or login credentials
            if (!employeeDbInterface.existsByUsername(username) && 
                !dbInterface.existsByUsername(username)) {
                return username;
            }
        }
        
        // If all combinations are taken, try sequential numbers
        for (int i = 0; i < 100; i++) {
            String username = baseName + String.format("%02d", i);
            if (!employeeDbInterface.existsByUsername(username) && 
                !dbInterface.existsByUsername(username)) {
                return username;
            }
        }
        
        return null; // Could not generate unique username
    }
    
    private String hashPassword(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
}
