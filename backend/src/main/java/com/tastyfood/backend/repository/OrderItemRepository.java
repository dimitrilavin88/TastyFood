package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, com.tastyfood.backend.domain.OrderItemId> {
    List<OrderItem> findByOrderId(Integer orderId);
    List<OrderItem> findByItemId(Integer itemId);
}
