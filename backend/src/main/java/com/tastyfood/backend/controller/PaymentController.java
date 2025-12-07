package com.tastyfood.backend.controller;

import com.tastyfood.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentService paymentService;
    
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processPayment(@RequestBody Map<String, Object> request) {
        try {
            // Extract payment information
            String cardNumber = (String) request.get("cardNumber");
            String expiryDate = (String) request.get("expiryDate");
            String cvv = (String) request.get("cvv");
            Object orderTotalObj = request.get("orderTotal");
            
            // Validate required fields
            if (cardNumber == null || expiryDate == null || cvv == null || orderTotalObj == null) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("approved", false);
                errorResponse.put("message", "Missing required payment information.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Convert order total to BigDecimal
            BigDecimal orderTotal;
            try {
                if (orderTotalObj instanceof Number) {
                    orderTotal = BigDecimal.valueOf(((Number) orderTotalObj).doubleValue());
                } else {
                    orderTotal = new BigDecimal(orderTotalObj.toString());
                }
            } catch (Exception e) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("approved", false);
                errorResponse.put("message", "Invalid order total amount.");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Remove spaces from card number if present
            cardNumber = cardNumber.replaceAll("\\s+", "");
            
            // Process the payment
            Map<String, Object> result = paymentService.processPayment(cardNumber, expiryDate, cvv, orderTotal);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("approved", false);
            errorResponse.put("message", "An error occurred while processing your payment. Please try again.");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}

