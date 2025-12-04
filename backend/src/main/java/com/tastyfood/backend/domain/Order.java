package com.tastyfood.backend.domain;

import com.tastyfood.backend.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @Column(name = "order_id", length = 6)
    private String orderId;
    
    @Column(name = "customer_name", nullable = false)
    private String customerName;
    
    @Column(name = "customer_phone", nullable = false)
    private String customerPhone;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_id")
    private DeliveryAddress deliveryAddress;
    
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @Column(name = "tip", precision = 10, scale = 2)
    private BigDecimal tip;
    
    @Column(name = "grand_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal grandTotal;
    
    @Convert(converter = com.tastyfood.backend.converter.OrderStatusConverter.class)
    @Column(name = "status", nullable = false)
    private OrderStatus status;
    
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @Column(name = "estimated_delivery_time")
    private Instant estimatedDeliveryTime;
    
    @Column(name = "delivered_at")
    private Instant deliveredAt;
    
    @Column(name = "special_instructions", length = 1000)
    private String specialInstructions;
    
    @Column(name = "last_updated_at", nullable = false)
    private Instant lastUpdatedAt;
    
    @Column(name = "driver_id", insertable = false, updatable = false)
    private Integer driverId;
    
    @Column(name = "address_id", insertable = false, updatable = false)
    private Integer addressId;
}
