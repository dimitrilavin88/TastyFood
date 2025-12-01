package com.tastyfood.backend.controller;

import com.tastyfood.backend.domain.ItemCategory;
import com.tastyfood.backend.domain.MenuItem;
import com.tastyfood.backend.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {
    
    @Autowired
    private MenuService menuService;
    
    @GetMapping("/categories")
    public ResponseEntity<List<ItemCategory>> getAllCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }
    
    @GetMapping("/categories/{id}")
    public ResponseEntity<ItemCategory> getCategory(@PathVariable Integer id) {
        Optional<ItemCategory> category = menuService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/items")
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuService.getAllMenuItems());
    }
    
    @GetMapping("/items/{id}")
    public ResponseEntity<MenuItem> getMenuItem(@PathVariable Integer id) {
        Optional<MenuItem> item = menuService.getMenuItemById(id);
        return item.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/items/category/{categoryId}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(menuService.getMenuItemsByCategory(categoryId));
    }
    
    @GetMapping("/items/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItems() {
        return ResponseEntity.ok(menuService.getAvailableMenuItems());
    }
    
    @PostMapping("/categories")
    public ResponseEntity<ItemCategory> createCategory(@RequestBody ItemCategory category) {
        return ResponseEntity.ok(menuService.createCategory(category));
    }
    
    @PostMapping("/items")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        return ResponseEntity.ok(menuService.createMenuItem(menuItem));
    }
}
