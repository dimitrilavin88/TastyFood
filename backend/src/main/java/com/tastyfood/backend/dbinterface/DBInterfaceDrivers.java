package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.Driver;
import com.tastyfood.backend.enums.DriverStatus;

import java.util.List;
import java.util.Optional;

public interface DBInterfaceDrivers {
    Optional<Driver> findById(Integer driverId);
    List<Driver> findAll();
    List<Driver> findByStatus(DriverStatus status);
    List<Driver> findByOnDelivery(Boolean onDelivery);
    Optional<Driver> findByCurrentOrderId(Integer orderId);
    Driver save(Driver driver);
    void deleteById(Integer driverId);
    boolean existsById(Integer driverId);
}
