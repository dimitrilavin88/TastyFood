package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {
    List<MenuItem> findByCategoryId(Integer categoryId);
    List<MenuItem> findByAvailability(Boolean availability);
    List<MenuItem> findByCategoryIdAndAvailability(Integer categoryId, Boolean availability);
}
