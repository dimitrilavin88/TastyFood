package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.Order;
import com.tastyfood.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByDriverId(Integer driverId);
    Optional<Order> findByOrderId(Integer orderId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
