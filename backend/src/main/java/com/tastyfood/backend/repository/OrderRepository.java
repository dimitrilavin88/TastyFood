package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.Order;
import com.tastyfood.backend.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status);
    List<Order> findByDriverId(Integer driverId);
    Optional<Order> findByOrderId(String orderId);
    List<Order> findAllByOrderByCreatedAtDesc();
    
    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.deliveredAt IS NULL ORDER BY o.createdAt DESC")
    List<Order> findByStatusAndDeliveredAtIsNullOrderByCreatedAtDesc(@Param("status") OrderStatus status);
}
