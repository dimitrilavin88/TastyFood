package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceItemCategories;
import com.tastyfood.backend.dbinterface.DBInterfaceMenuItems;
import com.tastyfood.backend.domain.ItemCategory;
import com.tastyfood.backend.domain.MenuItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {
    
    @Autowired
    private DBInterfaceItemCategories categoryDbInterface;
    
    @Autowired
    private DBInterfaceMenuItems menuItemDbInterface;
    
    // Category methods
    public List<ItemCategory> getAllCategories() {
        return categoryDbInterface.findAll();
    }
    
    public List<ItemCategory> getFeaturedCategories() {
        // is_featured column doesn't exist in database, return empty list
        return List.of();
    }
    
    public List<ItemCategory> getCategoriesOrdered() {
        return categoryDbInterface.findAllByOrderByDisplayOrderAsc();
    }
    
    public Optional<ItemCategory> getCategoryById(Integer categoryId) {
        return categoryDbInterface.findById(categoryId);
    }
    
    public ItemCategory createCategory(ItemCategory category) {
        return categoryDbInterface.save(category);
    }
    
    public ItemCategory updateCategory(ItemCategory category) {
        return categoryDbInterface.save(category);
    }
    
    public boolean deleteCategory(Integer categoryId) {
        if (!categoryDbInterface.existsById(categoryId)) {
            return false;
        }
        categoryDbInterface.deleteById(categoryId);
        return true;
    }
    
    // MenuItem methods
    public List<MenuItem> getAllMenuItems() {
        return menuItemDbInterface.findAll();
    }
    
    public Optional<MenuItem> getMenuItemById(Integer itemId) {
        return menuItemDbInterface.findById(itemId);
    }
    
    public List<MenuItem> getMenuItemsByCategory(Integer categoryId) {
        return menuItemDbInterface.findByCategoryId(categoryId);
    }
    
    public List<MenuItem> getAvailableMenuItems() {
        return menuItemDbInterface.findByAvailability(true);
    }
    
    public List<MenuItem> getAvailableMenuItemsByCategory(Integer categoryId) {
        return menuItemDbInterface.findByCategoryIdAndAvailability(categoryId, true);
    }
    
    public MenuItem createMenuItem(MenuItem menuItem) {
        if (menuItem.getAvailability() == null) {
            menuItem.setAvailability(true);
        }
        return menuItemDbInterface.save(menuItem);
    }
    
    public MenuItem updateMenuItem(MenuItem menuItem) {
        return menuItemDbInterface.save(menuItem);
    }
    
    public boolean deleteMenuItem(Integer itemId) {
        if (!menuItemDbInterface.existsById(itemId)) {
            return false;
        }
        menuItemDbInterface.deleteById(itemId);
        return true;
    }
}
