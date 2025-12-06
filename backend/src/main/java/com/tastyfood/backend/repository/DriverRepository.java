package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {
    // findByStatus removed - status column doesn't exist in database
    List<Driver> findByOnDelivery(Boolean onDelivery);
    Optional<Driver> findByCurrentOrderId(Integer orderId);
    Optional<Driver> findByFullName(String fullName);
}
