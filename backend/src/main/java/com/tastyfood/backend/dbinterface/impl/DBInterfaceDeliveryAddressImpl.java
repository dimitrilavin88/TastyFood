package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceDeliveryAddress;
import com.tastyfood.backend.domain.DeliveryAddress;
import com.tastyfood.backend.repository.DeliveryAddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DBInterfaceDeliveryAddressImpl implements DBInterfaceDeliveryAddress {
    
    @Autowired
    private DeliveryAddressRepository repository;
    
    @Override
    public Optional<DeliveryAddress> findById(Integer addressId) {
        return repository.findById(addressId);
    }
    
    @Override
    public Optional<DeliveryAddress> findByBuildingNumberAndStreetAndCityAndStateAndZipCode(
            Integer buildingNumber, String street, String city, String state, String zipCode) {
        return repository.findByBuildingNumberAndStreetAndCityAndStateAndZipCode(
            buildingNumber, street, city, state, zipCode);
    }
    
    @Override
    public List<DeliveryAddress> findAll() {
        return repository.findAll();
    }
    
    @Override
    public DeliveryAddress save(DeliveryAddress address) {
        return repository.save(address);
    }
    
    @Override
    public void deleteById(Integer addressId) {
        repository.deleteById(addressId);
    }
    
    @Override
    public boolean existsById(Integer addressId) {
        return repository.existsById(addressId);
    }
}
