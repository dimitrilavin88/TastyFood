package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceDeliveryAddress;
import com.tastyfood.backend.domain.DeliveryAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryAddressService {
    
    @Autowired
    private DBInterfaceDeliveryAddress dbInterface;
    
    public List<DeliveryAddress> getAllAddresses() {
        return dbInterface.findAll();
    }
    
    public Optional<DeliveryAddress> getAddressById(Integer addressId) {
        return dbInterface.findById(addressId);
    }
    
    /**
     * Finds an existing address or creates a new one if it doesn't exist
     * @param address The address to find or create
     * @return The existing or newly created address
     */
    public DeliveryAddress findOrCreateAddress(DeliveryAddress address) {
        // Check if address already exists (matching building number, street, city, state, zip code)
        Optional<DeliveryAddress> existingAddress = dbInterface.findByBuildingNumberAndStreetAndCityAndStateAndZipCode(
            address.getBuildingNumber(),
            address.getStreet(),
            address.getCity(),
            address.getState(),
            address.getZipCode()
        );
        
        if (existingAddress.isPresent()) {
            return existingAddress.get();
        }
        
        // Address doesn't exist, create a new one
        return dbInterface.save(address);
    }
    
    public DeliveryAddress createAddress(DeliveryAddress address) {
        return dbInterface.save(address);
    }
    
    public DeliveryAddress updateAddress(DeliveryAddress address) {
        return dbInterface.save(address);
    }
    
    public boolean deleteAddress(Integer addressId) {
        if (!dbInterface.existsById(addressId)) {
            return false;
        }
        dbInterface.deleteById(addressId);
        return true;
    }
}
