package com.tastyfood.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PaymentService {
    
    private final Random random = new Random();
    
    /**
     * Process a payment and determine if it should be approved or denied
     * @param cardNumber The card number (without spaces)
     * @param expiryDate The expiry date in MM/YY format
     * @param cvv The CVV code
     * @param orderTotal The total amount to charge
     * @return A map containing "approved" (boolean) and "message" (String) keys
     */
    public Map<String, Object> processPayment(String cardNumber, String expiryDate, String cvv, BigDecimal orderTotal) {
        Map<String, Object> response = new HashMap<>();
        
        // Step 1: Validate card format
        if (!isValidCardFormat(cardNumber, expiryDate, cvv)) {
            response.put("approved", false);
            response.put("message", "Invalid card information. Please check your card number, expiry date, or CVV.");
            return response;
        }
        
        // Step 2: Check if card has sufficient funds (random simulation)
        // Higher order totals have a higher chance of being denied
        boolean hasSufficientFunds = checkSufficientFunds(orderTotal);
        
        if (!hasSufficientFunds) {
            response.put("approved", false);
            response.put("message", "Insufficient funds. Your card does not have enough balance to complete this transaction.");
            return response;
        }
        
        // If we get here, payment is approved
        response.put("approved", true);
        response.put("message", "Payment approved successfully!");
        return response;
    }
    
    /**
     * Validates the card format (number, expiry date, CVV)
     * @param cardNumber Card number without spaces
     * @param expiryDate Expiry date in MM/YY format
     * @param cvv CVV code
     * @return true if card format is valid, false otherwise
     */
    private boolean isValidCardFormat(String cardNumber, String expiryDate, String cvv) {
        // Validate card number (must be 16 digits, not starting with 0)
        if (cardNumber == null || cardNumber.length() != 16) {
            return false;
        }
        if (cardNumber.startsWith("0")) {
            return false;
        }
        try {
            Long.parseLong(cardNumber); // Ensure it's all digits
        } catch (NumberFormatException e) {
            return false;
        }
        
        // Validate expiry date (MM/YY format)
        if (expiryDate == null || expiryDate.length() != 5 || !expiryDate.contains("/")) {
            return false;
        }
        String[] dateParts = expiryDate.split("/");
        if (dateParts.length != 2) {
            return false;
        }
        try {
            int month = Integer.parseInt(dateParts[0]);
            int year = Integer.parseInt(dateParts[1]);
            
            // Month must be 1-12
            if (month < 1 || month > 12) {
                return false;
            }
            
            // Check if card is expired
            LocalDate currentDate = LocalDate.now();
            int currentYear = currentDate.getYear() % 100;
            int currentMonth = currentDate.getMonthValue();
            
            if (year < currentYear || (year == currentYear && month < currentMonth)) {
                return false;
            }
        } catch (NumberFormatException e) {
            return false;
        }
        
        // Validate CVV (must be 3 digits)
        if (cvv == null || cvv.length() != 3) {
            return false;
        }
        try {
            Integer.parseInt(cvv);
        } catch (NumberFormatException e) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Simulates checking if the card has sufficient funds
     * Uses a random algorithm where higher order totals have a higher chance of denial
     * @param orderTotal The order total amount
     * @return true if funds are sufficient, false otherwise
     */
    private boolean checkSufficientFunds(BigDecimal orderTotal) {
        // Convert order total to double for easier calculation
        double total = orderTotal.doubleValue();
        
        // Base approval rate: 85% for orders under $20, decreasing as order total increases
        double approvalRate;
        if (total < 20.0) {
            approvalRate = 0.85; // 85% approval for small orders
        } else if (total < 50.0) {
            approvalRate = 0.75; // 75% approval for medium orders
        } else if (total < 100.0) {
            approvalRate = 0.65; // 65% approval for large orders
        } else {
            approvalRate = 0.50; // 50% approval for very large orders
        }
        
        // Generate random number between 0.0 and 1.0
        double randomValue = random.nextDouble();
        
        // If random value is less than approval rate, approve; otherwise deny
        return randomValue < approvalRate;
    }
}

