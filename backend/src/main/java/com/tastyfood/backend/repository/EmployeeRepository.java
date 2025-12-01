package com.tastyfood.backend.repository;

import com.tastyfood.backend.domain.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {
    Optional<Employee> findByUsername(String username);
    List<Employee> findByActiveStatus(Boolean activeStatus);
    List<Employee> findByRole(com.tastyfood.backend.enums.UserType role);
}
