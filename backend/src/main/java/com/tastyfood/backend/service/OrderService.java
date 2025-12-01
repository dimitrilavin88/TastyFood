package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceOrders;
import com.tastyfood.backend.dbinterface.DBInterfaceOrderItems;
import com.tastyfood.backend.domain.Order;
import com.tastyfood.backend.domain.OrderItem;
import com.tastyfood.backend.enums.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    
    @Autowired
    private DBInterfaceOrders orderDbInterface;
    
    @Autowired
    private DBInterfaceOrderItems orderItemDbInterface;
    
    @Autowired
    private MenuService menuService;
    
    @Autowired
    private DeliveryAddressService deliveryAddressService;
    
    public List<Order> getAllOrders() {
        return orderDbInterface.findAllByOrderByCreatedAtDesc();
    }
    
    public Optional<Order> getOrderById(Integer orderId) {
        return orderDbInterface.findById(orderId);
    }
    
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderDbInterface.findByStatus(status);
    }
    
    public List<Order> getOrdersByDriver(Integer driverId) {
        return orderDbInterface.findByDriverId(driverId);
    }
    
    @Transactional
    public Order createOrder(Order order, List<OrderItem> orderItems) {
        order.setCreatedAt(Instant.now());
        order.setLastUpdatedAt(Instant.now());
        if (order.getStatus() == null) {
            order.setStatus(OrderStatus.PENDING);
        }
        
        // Calculate totals
        BigDecimal subtotal = orderItems.stream()
            .map(item -> item.getLineTotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        order.setSubtotal(subtotal);
        BigDecimal tip = order.getTip() != null ? order.getTip() : BigDecimal.ZERO;
        order.setGrandTotal(subtotal.add(tip));
        
        Order savedOrder = orderDbInterface.save(order);
        
        // Save order items
        for (OrderItem item : orderItems) {
            item.setOrderId(savedOrder.getOrderId());
            orderItemDbInterface.save(item);
        }
        
        return savedOrder;
    }
    
    @Transactional
    public Order updateOrder(Order order) {
        order.setLastUpdatedAt(Instant.now());
        return orderDbInterface.save(order);
    }
    
    public List<OrderItem> getOrderItems(Integer orderId) {
        return orderItemDbInterface.findByOrderId(orderId);
    }
    
    @Transactional
    public boolean deleteOrder(Integer orderId) {
        if (!orderDbInterface.existsById(orderId)) {
            return false;
        }
        // Delete order items first
        List<OrderItem> items = orderItemDbInterface.findByOrderId(orderId);
        for (OrderItem item : items) {
            orderItemDbInterface.delete(item);
        }
        orderDbInterface.deleteById(orderId);
        return true;
    }
}
