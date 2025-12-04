package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceOrders;
import com.tastyfood.backend.domain.Order;
import com.tastyfood.backend.enums.OrderStatus;
import com.tastyfood.backend.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DBInterfaceOrdersImpl implements DBInterfaceOrders {
    
    @Autowired
    private OrderRepository repository;
    
    @Override
    public Optional<Order> findById(String orderId) {
        return repository.findById(orderId);
    }
    
    @Override
    public List<Order> findAll() {
        return repository.findAll();
    }
    
    @Override
    public List<Order> findByStatus(OrderStatus status) {
        return repository.findByStatus(status);
    }
    
    @Override
    public List<Order> findByDriverId(Integer driverId) {
        return repository.findByDriverId(driverId);
    }
    
    @Override
    public List<Order> findAllByOrderByCreatedAtDesc() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
    
    @Override
    public Order save(Order order) {
        return repository.save(order);
    }
    
    @Override
    public void deleteById(String orderId) {
        repository.deleteById(orderId);
    }
    
    @Override
    public boolean existsById(String orderId) {
        return repository.existsById(orderId);
    }
}
