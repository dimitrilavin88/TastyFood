package com.tastyfood.backend.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "item_categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Integer categoryId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "display_order")
    private Integer displayOrder;
    
    @Transient
    private Boolean isFeatured;
}
