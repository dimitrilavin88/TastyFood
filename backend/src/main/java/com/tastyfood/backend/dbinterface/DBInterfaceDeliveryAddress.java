package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.DeliveryAddress;

import java.util.List;
import java.util.Optional;

public interface DBInterfaceDeliveryAddress {
    Optional<DeliveryAddress> findById(Integer addressId);
    Optional<DeliveryAddress> findByBuildingNumberAndStreetAndCityAndStateAndZipCode(
        Integer buildingNumber, String street, String city, String state, String zipCode);
    Optional<DeliveryAddress> findMatchingAddress(
        Integer buildingNumber, String street, String aptUnit, String city, String state, String zipCode);
    List<DeliveryAddress> findAll();
    DeliveryAddress save(DeliveryAddress address);
    void deleteById(Integer addressId);
    boolean existsById(Integer addressId);
}
