package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceOrders;
import com.tastyfood.backend.dbinterface.DBInterfaceOrderItems;
import com.tastyfood.backend.domain.DeliveryAddress;
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
    
    /**
     * Generates a unique order ID in the format FD####
     * @return A unique order ID string in format FD####
     */
    private String generateUniqueOrderId() {
        java.util.Random random = new java.util.Random();
        String orderId;
        int maxAttempts = 100; // Prevent infinite loop
        int attempts = 0;
        
        do {
            // Generate 4 random digits
            int randomDigits = random.nextInt(10000); // 0-9999
            orderId = String.format("FD%04d", randomDigits);
            attempts++;
            
            if (attempts >= maxAttempts) {
                throw new RuntimeException("Unable to generate unique order ID after " + maxAttempts + " attempts");
            }
        } while (orderDbInterface.existsById(orderId));
        
        return orderId;
    }
    
    public List<Order> getAllOrders() {
        return orderDbInterface.findAllByOrderByCreatedAtDesc();
    }
    
    public Optional<Order> getOrderById(String orderId) {
        return orderDbInterface.findById(orderId);
    }
    
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderDbInterface.findByStatus(status);
    }
    
    public List<Order> getOrdersByDriver(Integer driverId) {
        return orderDbInterface.findByDriverId(driverId);
    }
    
    @Transactional
    public Order createOrder(Order order, List<OrderItem> orderItems, DeliveryAddress deliveryAddress) {
        order.setCreatedAt(Instant.now());
        order.setLastUpdatedAt(Instant.now());
        // Always set status to PENDING for new orders
        order.setStatus(OrderStatus.PENDING);
        // Ensure delivered_at is null for new orders (will be set later when order is delivered)
        order.setDeliveredAt(null);
        
        // Find or create delivery address
        if (deliveryAddress != null) {
            DeliveryAddress savedAddress = deliveryAddressService.findOrCreateAddress(deliveryAddress);
            order.setDeliveryAddress(savedAddress);
            order.setAddressId(savedAddress.getAddressId());
        }
        
        // Generate unique order ID in FD#### format
        String orderId = generateUniqueOrderId();
        order.setOrderId(orderId);
        
        // Calculate totals
        BigDecimal subtotal = orderItems.stream()
            .map(item -> item.getLineTotal())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        order.setSubtotal(subtotal);
        BigDecimal tip = order.getTip() != null ? order.getTip() : BigDecimal.ZERO;
        order.setGrandTotal(subtotal.add(tip));
        
        // Save the order to the database first
        Order savedOrder = orderDbInterface.save(order);
        
        // Save each order item to the order_items table
        // Each item is linked to the order via order_id
        for (OrderItem item : orderItems) {
            // Set the order_id to link this item to the saved order
            item.setOrderId(savedOrder.getOrderId());
            // Ensure all required fields are set
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new IllegalArgumentException("Order item quantity must be greater than 0");
            }
            if (item.getItemId() == null) {
                throw new IllegalArgumentException("Order item must have an item_id");
            }
            if (item.getUnitPrice() == null) {
                throw new IllegalArgumentException("Order item must have a unit_price");
            }
            if (item.getLineTotal() == null) {
                // Calculate line total if not set
                item.setLineTotal(item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())));
            }
            // Save the order item to the order_items table
            orderItemDbInterface.save(item);
        }
        
        return savedOrder;
    }
    
    @Transactional
    public Order updateOrder(Order order) {
        order.setLastUpdatedAt(Instant.now());
        return orderDbInterface.save(order);
    }
    
    public List<OrderItem> getOrderItems(String orderId) {
        return orderItemDbInterface.findByOrderId(orderId);
    }
    
    @Transactional
    public boolean deleteOrder(String orderId) {
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
