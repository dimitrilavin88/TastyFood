package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Integer> {
    // findByIsFeatured removed - is_featured column doesn't exist in database
    List<ItemCategory> findAllByOrderByDisplayOrderAsc();
}
