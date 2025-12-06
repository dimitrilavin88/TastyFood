package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.Driver;
import com.tastyfood.backend.enums.DriverStatus;

import java.util.List;
import java.util.Optional;

public interface DBInterfaceDrivers {
    Optional<Driver> findById(Integer driverId);
    List<Driver> findAll();
    // findByStatus removed - status column doesn't exist in database
    List<Driver> findByOnDelivery(Boolean onDelivery);
    Optional<Driver> findByCurrentOrderId(Integer orderId);
    Optional<Driver> findByFullName(String fullName);
    Driver save(Driver driver);
    void deleteById(Integer driverId);
    boolean existsById(Integer driverId);
}
