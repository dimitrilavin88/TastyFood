package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.Order;
import com.tastyfood.backend.enums.OrderStatus;

import java.util.List;
import java.util.Optional;

public interface DBInterfaceOrders {
    Optional<Order> findById(Integer orderId);
    List<Order> findAll();
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByDriverId(Integer driverId);
    List<Order> findAllByOrderByCreatedAtDesc();
    Order save(Order order);
    void deleteById(Integer orderId);
    boolean existsById(Integer orderId);
}
