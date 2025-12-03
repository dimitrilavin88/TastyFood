package com.tastyfood.backend.controller;

import com.tastyfood.backend.domain.Employee;
import com.tastyfood.backend.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        // Authenticate and get employee information
        Optional<Employee> employeeOpt = authenticationService.authenticateAndGetEmployee(username, password);
        
        if (employeeOpt.isPresent()) {
            Employee employee = employeeOpt.get();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("username", employee.getUsername());
            response.put("first_name", employee.getFirstName());
            response.put("last_name", employee.getLastName());
            response.put("role", employee.getRole().name().toLowerCase());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid username or password");
            return ResponseEntity.status(401).body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");
        
        Map<String, Object> response = new HashMap<>();
        boolean created = authenticationService.createCredentials(username, password);
        
        if (created) {
            response.put("success", true);
            response.put("message", "Registration successful");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Username already exists");
            return ResponseEntity.status(400).body(response);
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        
        Map<String, Object> response = new HashMap<>();
        
        // Validate input
        if (username == null || username.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Username is required");
            return ResponseEntity.status(400).body(response);
        }
        
        if (oldPassword == null || oldPassword.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Old password is required");
            return ResponseEntity.status(400).body(response);
        }
        
        if (newPassword == null || newPassword.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "New password is required");
            return ResponseEntity.status(400).body(response);
        }
        
        // Check if old and new passwords are the same
        if (oldPassword.equals(newPassword)) {
            response.put("success", false);
            response.put("message", "New password must be different from old password");
            return ResponseEntity.status(400).body(response);
        }
        
        // Change password (this will verify old password and update to new)
        boolean updated = authenticationService.changePassword(username, oldPassword, newPassword);
        
        if (updated) {
            response.put("success", true);
            response.put("message", "Password updated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid old password or user not found");
            return ResponseEntity.status(401).body(response);
        }
    }
}
