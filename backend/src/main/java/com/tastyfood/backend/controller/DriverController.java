package com.tastyfood.backend.controller;

import com.tastyfood.backend.domain.Driver;
import com.tastyfood.backend.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {
    
    @Autowired
    private DriverService driverService;
    
    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriver(@PathVariable Integer id) {
        Optional<Driver> driver = driverService.getDriverById(id);
        return driver.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }
    
    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody Map<String, String> request) {
        String firstName = request.get("firstName");
        String lastName = request.get("lastName");
        
        if (firstName == null || lastName == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Combine first and last name into full_name
        String fullName = firstName.trim() + " " + lastName.trim();
        
        Driver driver = new Driver();
        driver.setFullName(fullName);
        driver.setOnDelivery(false);
        // Status column doesn't exist in database, so we don't set it
        
        Driver created = driverService.createDriver(driver);
        return ResponseEntity.ok(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable Integer id, @RequestBody Driver driver) {
        driver.setDriverId(id);
        Driver updated = driverService.updateDriver(driver);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDriver(@PathVariable Integer id) {
        Map<String, String> response = new HashMap<>();
        if (driverService.deleteDriver(id)) {
            response.put("message", "Driver deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Driver not found");
            return ResponseEntity.status(404).body(response);
        }
    }
}

