package com.tastyfood.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HomeController {
    
    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> home() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "TastyFood Backend API is running");
        response.put("status", "OK");
        response.put("endpoints", Map.of(
            "auth", "/api/auth",
            "menu", "/api/menu",
            "orders", "/api/orders"
        ));
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/api")
    public ResponseEntity<Map<String, Object>> apiInfo() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "TastyFood Backend API");
        response.put("version", "1.0.0");
        response.put("endpoints", Map.of(
            "Authentication", Map.of(
                "POST /api/auth/login", "User login",
                "POST /api/auth/register", "User registration",
                "POST /api/auth/change-password", "Change password"
            ),
            "Menu", Map.of(
                "GET /api/menu/categories", "Get all categories",
                "GET /api/menu/items", "Get all menu items",
                "GET /api/menu/items/category/{categoryId}", "Get items by category"
            ),
            "Orders", Map.of(
                "GET /api/orders", "Get all orders",
                "GET /api/orders/{id}", "Get order by ID",
                "POST /api/orders", "Create new order"
            )
        ));
        return ResponseEntity.ok(response);
    }
}

