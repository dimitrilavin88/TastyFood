package com.tastyfood.backend.converter;

import com.tastyfood.backend.enums.OrderStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class OrderStatusConverter implements AttributeConverter<OrderStatus, String> {
    
    @Override
    public String convertToDatabaseColumn(OrderStatus orderStatus) {
        if (orderStatus == null) {
            return null;
        }
        
        // Map enum values to database values
        switch (orderStatus) {
            case PENDING:
                return "pending";
            case OUT_FOR_DELIVERY:
                return "in route"; // Map OUT_FOR_DELIVERY to "in route"
            case DELIVERED:
                return "delivered";
            default:
                // For other enum values, convert to lowercase with spaces
                return orderStatus.name().toLowerCase().replace("_", " ");
        }
    }
    
    @Override
    public OrderStatus convertToEntityAttribute(String dbValue) {
        if (dbValue == null || dbValue.isEmpty()) {
            return null;
        }
        
        // Map database values to enum values
        String normalized = dbValue.trim().toLowerCase();
        switch (normalized) {
            case "pending":
                return OrderStatus.PENDING;
            case "in route":
                return OrderStatus.OUT_FOR_DELIVERY; // Map "in route" to OUT_FOR_DELIVERY
            case "delivered":
                return OrderStatus.DELIVERED;
            default:
                // Try to convert from lowercase with spaces to enum
                String enumName = normalized.toUpperCase().replace(" ", "_");
                try {
                    return OrderStatus.valueOf(enumName);
                } catch (IllegalArgumentException e) {
                    // Default to PENDING if unknown value
                    return OrderStatus.PENDING;
                }
        }
    }
}

