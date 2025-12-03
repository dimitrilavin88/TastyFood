package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.ItemCategory;

import java.util.List;
import java.util.Optional;

public interface DBInterfaceItemCategories {
    Optional<ItemCategory> findById(Integer categoryId);
    List<ItemCategory> findAll();
    // findByIsFeatured removed - is_featured column doesn't exist in database
    List<ItemCategory> findAllByOrderByDisplayOrderAsc();
    ItemCategory save(ItemCategory category);
    void deleteById(Integer categoryId);
    boolean existsById(Integer categoryId);
}
