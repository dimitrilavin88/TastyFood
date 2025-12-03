package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.DeliveryAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Integer> {
    Optional<DeliveryAddress> findByBuildingNumberAndStreetAndCityAndStateAndZipCode(
        Integer buildingNumber, String street, String city, String state, String zipCode);
}
