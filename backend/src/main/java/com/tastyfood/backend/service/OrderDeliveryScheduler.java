package com.tastyfood.backend.service;

import com.tastyfood.backend.domain.Driver;
import com.tastyfood.backend.domain.Order;
import com.tastyfood.backend.enums.OrderStatus;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Scheduled task that automatically marks orders as delivered
 * when they have been "in route" for more than 1 minute
 */
@Component
public class OrderDeliveryScheduler {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderDeliveryScheduler.class);
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private DriverService driverService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    /**
     * Runs every minute to check for orders that have been "in route" for more than 1 minute
     * and automatically marks them as delivered
     */
    @Scheduled(fixedRate = 60000) // Run every 60 seconds (1 minute)
    @Transactional
    public void checkAndUpdateDeliveredOrders() {
        try {
            // Get all orders with status "in route" (OUT_FOR_DELIVERY)
            List<Order> inRouteOrders = orderService.getOrdersByStatus(OrderStatus.OUT_FOR_DELIVERY);
            
            Instant now = Instant.now();
            int updatedCount = 0;
            
            for (Order order : inRouteOrders) {
                // Check if the order has been "in route" for more than 1 minute
                // We check last_updated_at because that's when the status was changed to "in route"
                Instant lastUpdated = order.getLastUpdatedAt();
                if (lastUpdated != null) {
                    long minutesElapsed = (now.toEpochMilli() - lastUpdated.toEpochMilli()) / 60000;
                    
                    if (minutesElapsed >= 1) {
                        // Mark order as delivered
                        order.setStatus(OrderStatus.DELIVERED);
                        order.setDeliveredAt(now);
                        order.setLastUpdatedAt(now);
                        
                        // Update the order in the database
                        orderService.updateOrder(order);
                        
                        // Explicitly update delivered_at using native query to ensure it's saved
                        long deliveredAtMs = now.toEpochMilli();
                        entityManager.createNativeQuery("UPDATE orders SET status = ?, delivered_at = ?, last_updated_at = ? WHERE order_id = ?")
                            .setParameter(1, "delivered")
                            .setParameter(2, deliveredAtMs)
                            .setParameter(3, deliveredAtMs)
                            .setParameter(4, order.getOrderId())
                            .executeUpdate();
                        
                        // Update driver's on_delivery status to false
                        if (order.getDriverId() != null) {
                            var driverOpt = driverService.getDriverById(order.getDriverId());
                            if (driverOpt.isPresent()) {
                                Driver driver = driverOpt.get();
                                driver.setOnDelivery(false);
                                driverService.updateDriver(driver);
                                logger.info("Updated driver {} on_delivery to false for order {}", 
                                    driver.getFullName(), order.getOrderId());
                            }
                        }
                        
                        updatedCount++;
                        logger.info("Automatically marked order {} as delivered (was in route for {} minutes)", 
                            order.getOrderId(), minutesElapsed);
                    }
                }
            }
            
            if (updatedCount > 0) {
                logger.info("Automatically updated {} order(s) to delivered status", updatedCount);
            }
        } catch (Exception e) {
            logger.error("Error in scheduled task to check delivered orders", e);
        }
    }
}

