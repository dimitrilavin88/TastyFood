package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceMenuItems;
import com.tastyfood.backend.domain.MenuItem;
import com.tastyfood.backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DBInterfaceMenuItemsImpl implements DBInterfaceMenuItems {
    
    @Autowired
    private MenuItemRepository repository;
    
    @Override
    public Optional<MenuItem> findById(Integer itemId) {
        return repository.findById(itemId);
    }
    
    @Override
    public List<MenuItem> findAll() {
        return repository.findAll();
    }
    
    @Override
    public List<MenuItem> findByCategoryId(Integer categoryId) {
        return repository.findByCategoryId(categoryId);
    }
    
    @Override
    public MenuItem save(MenuItem menuItem) {
        return repository.save(menuItem);
    }
    
    @Override
    public void deleteById(Integer itemId) {
        repository.deleteById(itemId);
    }
    
    @Override
    public boolean existsById(Integer itemId) {
        return repository.existsById(itemId);
    }
}
