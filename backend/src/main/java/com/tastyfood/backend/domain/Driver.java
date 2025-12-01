package com.tastyfood.backend.domain;

import com.tastyfood.backend.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "driver_id")
    private Integer driverId;
    
    @Column(name = "full_name", nullable = false)
    private String fullName;
    
    @Column(name = "on_delivery", nullable = false)
    private Boolean onDelivery;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DriverStatus status;
    
    @Column(name = "vehicle_description")
    private String vehicleDescription;
    
    @Column(name = "current_order_id")
    private Integer currentOrderId;
}
