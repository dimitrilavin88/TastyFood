package com.tastyfood.backend.domain;

import com.tastyfood.backend.enums.UserType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Employee {
    @Id
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(name = "first_name", nullable = false)
    private String firstName;
    
    @Column(name = "last_name", nullable = false)
    private String lastName;
    
    @Convert(converter = com.tastyfood.backend.converter.UserTypeConverter.class)
    @Column(name = "role", nullable = false)
    private UserType role;
    
    @Column(name = "active_status", nullable = false)
    private Boolean activeStatus;
    
    @Column(name = "hire_date")
    private LocalDate hireDate;
    
    @Column(name = "last_active_at")
    private Instant lastActiveAt;
}
