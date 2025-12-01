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
