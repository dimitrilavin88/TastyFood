package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceLoginCredentials;
import com.tastyfood.backend.domain.LoginCredentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class AuthenticationService {
    
    @Autowired
    private DBInterfaceLoginCredentials dbInterface;
    
    public boolean authenticate(String username, String password) {
        Optional<LoginCredentials> credentials = dbInterface.findByUsername(username);
        if (credentials.isEmpty()) {
            return false;
        }
        
        String hashedPassword = hashPassword(password);
        return credentials.get().getPasswordHash().equals(hashedPassword);
    }
    
    public boolean createCredentials(String username, String password) {
        if (dbInterface.existsByUsername(username)) {
            return false; // Username already exists
        }
        
        String hashedPassword = hashPassword(password);
        LoginCredentials credentials = new LoginCredentials();
        credentials.setUsername(username);
        credentials.setPasswordHash(hashedPassword);
        
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
