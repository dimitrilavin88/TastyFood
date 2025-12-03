package com.tastyfood.backend.converter;

import com.tastyfood.backend.enums.UserType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class UserTypeConverter implements AttributeConverter<UserType, String> {
    
    @Override
    public String convertToDatabaseColumn(UserType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name().toLowerCase();
    }
    
    @Override
    public UserType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            // Try to match case-insensitively
            return UserType.valueOf(dbData.toUpperCase());
        } catch (IllegalArgumentException e) {
            // If exact match fails, try case-insensitive matching
            for (UserType type : UserType.values()) {
                if (type.name().equalsIgnoreCase(dbData)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown UserType: " + dbData);
        }
    }
}

