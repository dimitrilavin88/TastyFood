package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceDrivers;
import com.tastyfood.backend.domain.Driver;
import com.tastyfood.backend.enums.DriverStatus;
import com.tastyfood.backend.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DBInterfaceDriversImpl implements DBInterfaceDrivers {
    
    @Autowired
    private DriverRepository repository;
    
    @Override
    public Optional<Driver> findById(Integer driverId) {
        return repository.findById(driverId);
    }
    
    @Override
    public List<Driver> findAll() {
        return repository.findAll();
    }
    
    @Override
    public List<Driver> findByStatus(DriverStatus status) {
        return repository.findByStatus(status);
    }
    
    @Override
    public List<Driver> findByOnDelivery(Boolean onDelivery) {
        return repository.findByOnDelivery(onDelivery);
    }
    
    @Override
    public Optional<Driver> findByCurrentOrderId(Integer orderId) {
        return repository.findByCurrentOrderId(orderId);
    }
    
    @Override
    public Driver save(Driver driver) {
        return repository.save(driver);
    }
    
    @Override
    public void deleteById(Integer driverId) {
        repository.deleteById(driverId);
    }
    
    @Override
    public boolean existsById(Integer driverId) {
        return repository.existsById(driverId);
    }
}
