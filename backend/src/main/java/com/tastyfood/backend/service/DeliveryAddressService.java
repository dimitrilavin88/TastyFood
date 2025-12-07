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
     * Matches on building number, street, aptUnit (if provided), city, state, and zip code
     * Uses case-insensitive matching for string fields
     * @param address The address to find or create
     * @return The existing or newly created address
     */
    public DeliveryAddress findOrCreateAddress(DeliveryAddress address) {
        // Normalize aptUnit: if empty string, treat as null
        String aptUnit = (address.getAptUnit() != null && address.getAptUnit().trim().isEmpty()) 
            ? null 
            : address.getAptUnit();
        
        // Check if address already exists (matching all fields including aptUnit)
        Optional<DeliveryAddress> existingAddress = dbInterface.findMatchingAddress(
            address.getBuildingNumber(),
            address.getStreet(),
            aptUnit,
            address.getCity(),
            address.getState(),
            address.getZipCode()
        );
        
        if (existingAddress.isPresent()) {
            // Address already exists, return the existing one
            return existingAddress.get();
        }
        
        // Address doesn't exist, create a new one
        // Ensure aptUnit is normalized before saving
        address.setAptUnit(aptUnit);
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
