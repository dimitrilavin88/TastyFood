package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.Employee;
import com.tastyfood.backend.enums.UserType;

import java.util.List;
import java.util.Optional;

public interface DBInterfaceEmployees {
    Optional<Employee> findByUsername(String username);
    List<Employee> findAll();
    List<Employee> findByActiveStatus(Boolean activeStatus);
    List<Employee> findByRole(UserType role);
    Employee save(Employee employee);
    void deleteByUsername(String username);
    boolean existsByUsername(String username);
}
