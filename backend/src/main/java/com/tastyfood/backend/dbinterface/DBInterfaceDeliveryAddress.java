package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.DeliveryAddress;

import java.util.List;
import java.util.Optional;

public interface DBInterfaceDeliveryAddress {
    Optional<DeliveryAddress> findById(Integer addressId);
    List<DeliveryAddress> findAll();
    DeliveryAddress save(DeliveryAddress address);
    void deleteById(Integer addressId);
    boolean existsById(Integer addressId);
}
