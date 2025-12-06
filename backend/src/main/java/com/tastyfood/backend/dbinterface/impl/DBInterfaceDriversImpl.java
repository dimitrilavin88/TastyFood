package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceDrivers;
import com.tastyfood.backend.domain.Driver;
import com.tastyfood.backend.repository.DriverRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Component
public class DBInterfaceDriversImpl implements DBInterfaceDrivers {
    
    @Autowired
    private DriverRepository repository;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public Optional<Driver> findById(Integer driverId) {
        return repository.findById(driverId);
    }
    
    @Override
    public List<Driver> findAll() {
        return repository.findAll();
    }
    
    // findByStatus removed - status column doesn't exist in database
    
    @Override
    public List<Driver> findByOnDelivery(Boolean onDelivery) {
        return repository.findByOnDelivery(onDelivery);
    }
    
    @Override
    public Optional<Driver> findByCurrentOrderId(Integer orderId) {
        return repository.findByCurrentOrderId(orderId);
    }
    
    @Override
    public Optional<Driver> findByFullName(String fullName) {
        return repository.findByFullName(fullName);
    }
    
    @Override
    @Transactional
    public Driver save(Driver driver) {
        if (driver.getDriverId() == null) {
            // For new drivers, persist and then get the ID using last_insert_rowid()
            entityManager.persist(driver);
            entityManager.flush();
            // Query for the last inserted rowid
            Object result = entityManager.createNativeQuery("SELECT last_insert_rowid()").getSingleResult();
            if (result instanceof Number) {
                driver.setDriverId(((Number) result).intValue());
            }
            return driver;
        } else {
            // For existing drivers, use merge
        return repository.save(driver);
        }
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
