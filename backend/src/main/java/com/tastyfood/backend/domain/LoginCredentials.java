package com.tastyfood.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "login_credentials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginCredentials {
    @Id
    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    @Column(name = "password", nullable = false)
    private String passwordHash;
    
    @Column(name = "usertype", nullable = false)
    private String userType;
    
    @OneToOne
    @JoinColumn(name = "username", referencedColumnName = "username")
    private Employee employee;
}
