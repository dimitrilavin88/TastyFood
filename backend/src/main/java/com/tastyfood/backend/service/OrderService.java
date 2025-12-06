package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceOrders;
import com.tastyfood.backend.dbinterface.DBInterfaceOrderItems;
import com.tastyfood.backend.domain.DeliveryAddress;
import com.tastyfood.backend.domain.Driver;
import com.tastyfood.backend.domain.Order;
import com.tastyfood.backend.domain.OrderItem;
import com.tastyfood.backend.enums.OrderStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
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
    
    @Autowired
    private DriverService driverService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
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
        return orderDbInterface.findByStatusOrderByCreatedAtDesc(status);
    }
    
    /**
     * Get delivered orders that haven't had their delivery timestamp recorded yet
     * @return List of delivered orders with delivered_at = NULL
     */
    public List<Order> getDeliveredOrdersWithoutTimestamp() {
        return orderDbInterface.findByStatusAndDeliveredAtIsNullOrderByCreatedAtDesc(OrderStatus.DELIVERED);
    }
    
    public List<Order> getOrdersByDriver(Integer driverId) {
        return orderDbInterface.findByDriverId(driverId);
    }
    
    /**
     * Calculate estimated delivery time based on order size
     * Larger orders (more items/quantities) get longer ETAs
     * @param orderItems List of order items with quantities
     * @param createdAt When the order was created
     * @return Estimated delivery time as Instant
     */
    private Instant calculateEstimatedDeliveryTime(List<OrderItem> orderItems, Instant createdAt) {
        if (orderItems == null || orderItems.isEmpty()) {
            return null;
        }
        
        // Calculate total quantity of items
        int totalQuantity = orderItems.stream()
            .mapToInt(item -> item.getQuantity() != null ? item.getQuantity() : 0)
            .sum();
        
        // Base preparation time: 22 minutes
        int baseMinutes = 22;
        
        // Additional time per item: 2.5 minutes per item
        double minutesPerItem = 2.5;
        double additionalMinutes = totalQuantity * minutesPerItem;
        
        // For very large orders (10+ items), add extra buffer
        int largeOrderBuffer = totalQuantity >= 10 ? 5 : 0;
        
        // Total estimated minutes
        double totalMinutes = baseMinutes + additionalMinutes + largeOrderBuffer;
        
        // Round to nearest 5 minutes for cleaner display
        long roundedMinutes = (long) Math.ceil(totalMinutes / 5.0) * 5;
        
        // Calculate ETA from order creation time
        return createdAt.plusSeconds(roundedMinutes * 60);
    }
    
    @Transactional
    public Order createOrder(Order order, List<OrderItem> orderItems, DeliveryAddress deliveryAddress) {
        Instant createdAt = Instant.now();
        order.setCreatedAt(createdAt);
        order.setLastUpdatedAt(Instant.now());
        // Always set status to PENDING for new orders
        order.setStatus(OrderStatus.PENDING);
        // Ensure delivered_at is null for new orders (will be set later when order is delivered)
        order.setDeliveredAt(null);
        
        // Calculate and set estimated delivery time based on order size
        Instant estimatedDeliveryTime = calculateEstimatedDeliveryTime(orderItems, createdAt);
        order.setEstimatedDeliveryTime(estimatedDeliveryTime);
        
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
    
    /**
     * Save order to queue: update status to OUT_FOR_DELIVERY, assign driver, and set estimated delivery time if needed
     * @param orderId The order ID
     * @param driverFullName The full name of the driver to assign
     * @return Updated order
     */
    @Transactional
    public Order saveOrderToQueue(String orderId, String driverFullName) {
        Optional<Order> orderOpt = orderDbInterface.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        // Update status to OUT_FOR_DELIVERY ("in route")
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        
        // Find and assign driver
        Optional<Driver> driverOpt = driverService.getDriverByFullName(driverFullName);
        if (driverOpt.isEmpty()) {
            throw new IllegalArgumentException("Driver not found: " + driverFullName);
        }
        
        Driver driver = driverOpt.get();
        // Set the driver relationship (this will update driver_id in the database)
        order.setDriver(driver);
        
        // Get order items to calculate ETA
        List<OrderItem> orderItems = orderItemDbInterface.findByOrderId(orderId);
        Instant estimatedDeliveryTime = calculateEstimatedDeliveryTime(orderItems, order.getCreatedAt());
        order.setEstimatedDeliveryTime(estimatedDeliveryTime);
        
        // Update driver's on_delivery status to true
        driver.setOnDelivery(true);
        driverService.updateDriver(driver);
        
        order.setLastUpdatedAt(Instant.now());
        
        // Save the order first to update status and other fields
        Order savedOrder = orderDbInterface.save(order);
        
        // Explicitly update driver_id and estimated_delivery_time using native query
        // Convert Instant to milliseconds (SQLite stores timestamps as milliseconds since epoch)
        if (estimatedDeliveryTime != null) {
            long estimatedDeliveryTimeMs = estimatedDeliveryTime.toEpochMilli();
            entityManager.createNativeQuery("UPDATE orders SET driver_id = ?, estimated_delivery_time = ? WHERE order_id = ?")
                .setParameter(1, driver.getDriverId())
                .setParameter(2, estimatedDeliveryTimeMs)
                .setParameter(3, orderId)
                .executeUpdate();
        } else {
            // If no ETA, just update driver_id
            entityManager.createNativeQuery("UPDATE orders SET driver_id = ? WHERE order_id = ?")
                .setParameter(1, driver.getDriverId())
                .setParameter(2, orderId)
                .executeUpdate();
        }
        
        // Refresh the order entity to get the updated fields
        entityManager.refresh(savedOrder);
        
        return savedOrder;
    }
    
    public List<OrderItem> getOrderItems(String orderId) {
        return orderItemDbInterface.findByOrderId(orderId);
    }
    
    /**
     * Record delivery: set delivered_at timestamp for an order
     * @param orderId The order ID
     * @param deliveredAt The timestamp when delivery was completed
     * @return Updated order
     */
    @Transactional
    public Order recordDelivery(String orderId, Instant deliveredAt) {
        Optional<Order> orderOpt = orderDbInterface.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found: " + orderId);
        }
        
        Order order = orderOpt.get();
        
        // Set delivered_at timestamp
        order.setDeliveredAt(deliveredAt);
        order.setLastUpdatedAt(Instant.now());
        
        // Update the order in the database
        Order savedOrder = orderDbInterface.save(order);
        
        // Explicitly update delivered_at using native query to ensure it's saved
        long deliveredAtMs = deliveredAt.toEpochMilli();
        long lastUpdatedMs = Instant.now().toEpochMilli();
        entityManager.createNativeQuery("UPDATE orders SET delivered_at = ?, last_updated_at = ? WHERE order_id = ?")
            .setParameter(1, deliveredAtMs)
            .setParameter(2, lastUpdatedMs)
            .setParameter(3, orderId)
            .executeUpdate();
        
        // Refresh the order entity
        entityManager.refresh(savedOrder);
        
        return savedOrder;
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
