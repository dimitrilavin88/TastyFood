package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceOrderItems;
import com.tastyfood.backend.domain.OrderItem;
import com.tastyfood.backend.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DBInterfaceOrderItemsImpl implements DBInterfaceOrderItems {
    
    @Autowired
    private OrderItemRepository repository;
    
    @Override
    public List<OrderItem> findAll() {
        return repository.findAll();
    }
    
    @Override
    public List<OrderItem> findByOrderId(String orderId) {
        return repository.findByOrderId(orderId);
    }
    
    @Override
    public List<OrderItem> findByItemId(Integer itemId) {
        return repository.findByItemId(itemId);
    }
    
    @Override
    public OrderItem save(OrderItem orderItem) {
        return repository.save(orderItem);
    }
    
    @Override
    public void delete(OrderItem orderItem) {
        repository.delete(orderItem);
    }
    
    @Override
    public void deleteByOrderId(String orderId) {
        List<OrderItem> items = repository.findByOrderId(orderId);
        repository.deleteAll(items);
    }
}
