package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.DeliveryAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryAddressRepository extends JpaRepository<DeliveryAddress, Integer> {
    Optional<DeliveryAddress> findByBuildingNumberAndStreetAndCityAndStateAndZipCode(
        Integer buildingNumber, String street, String city, String state, String zipCode);
    
    /**
     * Finds an address matching all fields including aptUnit (case-insensitive for strings)
     * If aptUnit is null in the search, it will match addresses where aptUnit is also null
     */
    @Query("SELECT a FROM DeliveryAddress a WHERE " +
           "a.buildingNumber = :buildingNumber AND " +
           "LOWER(TRIM(a.street)) = LOWER(TRIM(:street)) AND " +
           "LOWER(TRIM(a.city)) = LOWER(TRIM(:city)) AND " +
           "LOWER(TRIM(a.state)) = LOWER(TRIM(:state)) AND " +
           "a.zipCode = :zipCode AND " +
           "((:aptUnit IS NULL AND a.aptUnit IS NULL) OR " +
           "(:aptUnit IS NOT NULL AND a.aptUnit IS NOT NULL AND LOWER(TRIM(:aptUnit)) = LOWER(TRIM(a.aptUnit))))")
    Optional<DeliveryAddress> findMatchingAddress(
        @Param("buildingNumber") Integer buildingNumber,
        @Param("street") String street,
        @Param("aptUnit") String aptUnit,
        @Param("city") String city,
        @Param("state") String state,
        @Param("zipCode") String zipCode);
}
