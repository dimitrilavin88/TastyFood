package com.tastyfood.backend.controller;

import com.tastyfood.backend.domain.Employee;
import com.tastyfood.backend.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {
    
    @Autowired
    private EmployeeService employeeService;
    
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<Employee> getEmployee(@PathVariable String username) {
        Optional<Employee> employee = employeeService.getEmployeeByUsername(username);
        return employee.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<Employee>> getActiveEmployees() {
        return ResponseEntity.ok(employeeService.getActiveEmployees());
    }
    
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
        Employee created = employeeService.createEmployee(employee);
        return ResponseEntity.ok(created);
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerEmployee(@RequestBody Map<String, String> request) {
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        String password = request.get("password");
        String roleStr = request.get("role");
        
        if (firstName == null || lastName == null || password == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "firstName, lastName, and password are required");
            return ResponseEntity.status(400).body(error);
        }
        
        com.tastyfood.backend.enums.UserType role = null;
        if (roleStr != null) {
            try {
                role = com.tastyfood.backend.enums.UserType.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Invalid role, will default to STAFF
            }
        }
        
        Employee created = employeeService.registerNewEmployee(firstName, lastName, password, role);
        
        Map<String, Object> response = new HashMap<>();
        if (created != null) {
            response.put("success", true);
            response.put("employee", created);
            response.put("username", created.getUsername());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Failed to register employee. Could not generate unique username.");
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @PutMapping("/{username}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable String username, @RequestBody Employee employee) {
        employee.setUsername(username);
        Employee updated = employeeService.updateEmployee(employee);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{username}")
    public ResponseEntity<Map<String, String>> deleteEmployee(@PathVariable String username) {
        Map<String, String> response = new HashMap<>();
        if (employeeService.deleteEmployee(username)) {
            response.put("message", "Employee deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Employee not found");
            return ResponseEntity.status(404).body(response);
        }
    }
}

