package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceItemCategories;
import com.tastyfood.backend.domain.ItemCategory;
import com.tastyfood.backend.repository.ItemCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DBInterfaceItemCategoriesImpl implements DBInterfaceItemCategories {
    
    @Autowired
    private ItemCategoryRepository repository;
    
    @Override
    public Optional<ItemCategory> findById(Integer categoryId) {
        return repository.findById(categoryId);
    }
    
    @Override
    public List<ItemCategory> findAll() {
        return repository.findAll();
    }
    
    @Override
    public List<ItemCategory> findByIsFeatured(Boolean isFeatured) {
        return repository.findByIsFeatured(isFeatured);
    }
    
    @Override
    public List<ItemCategory> findAllByOrderByDisplayOrderAsc() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }
    
    @Override
    public ItemCategory save(ItemCategory category) {
        return repository.save(category);
    }
    
    @Override
    public void deleteById(Integer categoryId) {
        repository.deleteById(categoryId);
    }
    
    @Override
    public boolean existsById(Integer categoryId) {
        return repository.existsById(categoryId);
    }
}
