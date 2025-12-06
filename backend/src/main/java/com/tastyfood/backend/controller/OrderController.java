package com.tastyfood.backend.controller;

import com.tastyfood.backend.domain.DeliveryAddress;
import com.tastyfood.backend.domain.Order;
import com.tastyfood.backend.domain.OrderItem;
import com.tastyfood.backend.enums.OrderStatus;
import com.tastyfood.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(@PathVariable String id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable String status) {
        // Convert string status to enum (handle case-insensitive)
        OrderStatus orderStatus;
        try {
            // Try to match the database format first (lowercase)
            String normalized = status.trim().toLowerCase();
            if (normalized.equals("pending")) {
                orderStatus = OrderStatus.PENDING;
            } else if (normalized.equals("in route")) {
                orderStatus = OrderStatus.OUT_FOR_DELIVERY;
            } else if (normalized.equals("delivered")) {
                orderStatus = OrderStatus.DELIVERED;
            } else {
                // Try enum value directly (uppercase)
                orderStatus = OrderStatus.valueOf(status.toUpperCase());
            }
        } catch (IllegalArgumentException e) {
            // If status doesn't match any enum value, return bad request
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.getOrdersByStatus(orderStatus));
    }
    
    @GetMapping("/{id}/items")
    public ResponseEntity<List<OrderItem>> getOrderItems(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderItems(id));
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> request) {
        Order order = new Order();
        order.setCustomerName((String) request.get("customerName"));
        order.setCustomerPhone((String) request.get("customerPhone"));
        
        // Extract tip amount
        Object tipObj = request.get("tip");
        if (tipObj != null) {
            try {
                BigDecimal tip = new BigDecimal(tipObj.toString());
                order.setTip(tip);
            } catch (NumberFormatException e) {
                // If tip is invalid, set to zero
                order.setTip(BigDecimal.ZERO);
            }
        } else {
            order.setTip(BigDecimal.ZERO);
        }
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> itemsData = (List<Map<String, Object>>) request.get("items");
        
        List<OrderItem> orderItems = itemsData.stream()
            .map(itemData -> {
                OrderItem item = new OrderItem();
                item.setItemId((Integer) itemData.get("itemId"));
                item.setQuantity((Integer) itemData.get("quantity"));
                item.setUnitPrice(new java.math.BigDecimal(itemData.get("unitPrice").toString()));
                item.setLineTotal(item.getUnitPrice().multiply(new java.math.BigDecimal(item.getQuantity())));
                return item;
            })
            .toList();
        
        // Extract delivery address information
        DeliveryAddress deliveryAddress = null;
        @SuppressWarnings("unchecked")
        Map<String, Object> addressData = (Map<String, Object>) request.get("deliveryAddress");
        if (addressData != null) {
            deliveryAddress = new DeliveryAddress();
            Object buildingNumberObj = addressData.get("buildingNumber");
            if (buildingNumberObj != null) {
                try {
                    deliveryAddress.setBuildingNumber(Integer.parseInt(buildingNumberObj.toString()));
                } catch (NumberFormatException e) {
                    // Handle invalid building number
                }
            }
            deliveryAddress.setStreet((String) addressData.get("street"));
            deliveryAddress.setAptUnit((String) addressData.get("aptUnit"));
            deliveryAddress.setCity((String) addressData.get("city"));
            deliveryAddress.setState((String) addressData.get("state"));
            Object zipCodeObj = addressData.get("zipCode");
            if (zipCodeObj != null) {
                deliveryAddress.setZipCode(zipCodeObj.toString());
            }
            deliveryAddress.setInstructions((String) addressData.get("instructions"));
        }
        
        Order createdOrder = orderService.createOrder(order, orderItems, deliveryAddress);
        return ResponseEntity.ok(createdOrder);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable String id, @RequestBody Order order) {
        order.setOrderId(id);
        return ResponseEntity.ok(orderService.updateOrder(order));
    }
    
    @PostMapping("/{id}/save-to-queue")
    public ResponseEntity<Order> saveOrderToQueue(@PathVariable String id, @RequestBody Map<String, String> request) {
        String driverFullName = request.get("driverFullName");
        if (driverFullName == null || driverFullName.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            Order updatedOrder = orderService.saveOrderToQueue(id, driverFullName);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteOrder(@PathVariable String id) {
        Map<String, String> response = new HashMap<>();
        if (orderService.deleteOrder(id)) {
            response.put("message", "Order deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Order not found");
            return ResponseEntity.status(404).body(response);
        }
    }
}
