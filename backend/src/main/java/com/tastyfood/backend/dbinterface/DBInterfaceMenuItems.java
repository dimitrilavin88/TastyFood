package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.MenuItem;

import java.util.List;
import java.util.Optional;

public interface DBInterfaceMenuItems {
    Optional<MenuItem> findById(Integer itemId);
    List<MenuItem> findAll();
    List<MenuItem> findByCategoryId(Integer categoryId);
    List<MenuItem> findByAvailability(Boolean availability);
    List<MenuItem> findByCategoryIdAndAvailability(Integer categoryId, Boolean availability);
    MenuItem save(MenuItem menuItem);
    void deleteById(Integer itemId);
    boolean existsById(Integer itemId);
}
