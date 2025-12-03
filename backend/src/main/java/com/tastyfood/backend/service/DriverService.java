package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceDrivers;
import com.tastyfood.backend.domain.Driver;
import com.tastyfood.backend.enums.DriverStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DriverService {
    
    @Autowired
    private DBInterfaceDrivers dbInterface;
    
    public List<Driver> getAllDrivers() {
        return dbInterface.findAll();
    }
    
    public Optional<Driver> getDriverById(Integer driverId) {
        return dbInterface.findById(driverId);
    }
    
    public List<Driver> getAvailableDrivers() {
        // Status column doesn't exist, so return drivers that are not on delivery
        return dbInterface.findByOnDelivery(false);
    }
    
    public List<Driver> getDriversOnDelivery() {
        return dbInterface.findByOnDelivery(true);
    }
    
    public Optional<Driver> getDriverByCurrentOrder(Integer orderId) {
        return dbInterface.findByCurrentOrderId(orderId);
    }
    
    public Driver createDriver(Driver driver) {
        // Status column doesn't exist in database, so we don't set it
        if (driver.getOnDelivery() == null) {
            driver.setOnDelivery(false);
        }
        return dbInterface.save(driver);
    }
    
    public Driver updateDriver(Driver driver) {
        return dbInterface.save(driver);
    }
    
    public boolean deleteDriver(Integer driverId) {
        if (!dbInterface.existsById(driverId)) {
            return false;
        }
        dbInterface.deleteById(driverId);
        return true;
    }
}
