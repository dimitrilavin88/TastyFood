package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.OrderItem;

import java.util.List;

public interface DBInterfaceOrderItems {
    List<OrderItem> findAll();
    List<OrderItem> findByOrderId(Integer orderId);
    List<OrderItem> findByItemId(Integer itemId);
    OrderItem save(OrderItem orderItem);
    void delete(OrderItem orderItem);
    void deleteByOrderId(Integer orderId);
}
