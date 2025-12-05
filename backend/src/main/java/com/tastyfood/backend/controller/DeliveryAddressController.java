package com.tastyfood.backend.controller;

import com.tastyfood.backend.domain.DeliveryAddress;
import com.tastyfood.backend.service.DeliveryAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/delivery-addresses")
@CrossOrigin(origins = "*")
public class DeliveryAddressController {
    
    @Autowired
    private DeliveryAddressService deliveryAddressService;
    
    @GetMapping
    public ResponseEntity<List<DeliveryAddress>> getAllAddresses() {
        return ResponseEntity.ok(deliveryAddressService.getAllAddresses());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<DeliveryAddress> getAddressById(@PathVariable Integer id) {
        Optional<DeliveryAddress> address = deliveryAddressService.getAddressById(id);
        return address.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
}

