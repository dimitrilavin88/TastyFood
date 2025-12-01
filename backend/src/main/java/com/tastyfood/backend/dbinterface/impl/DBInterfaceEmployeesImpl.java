package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceEmployees;
import com.tastyfood.backend.domain.Employee;
import com.tastyfood.backend.enums.UserType;
import com.tastyfood.backend.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class DBInterfaceEmployeesImpl implements DBInterfaceEmployees {
    
    @Autowired
    private EmployeeRepository repository;
    
    @Override
    public Optional<Employee> findByUsername(String username) {
        return repository.findByUsername(username);
    }
    
    @Override
    public List<Employee> findAll() {
        return repository.findAll();
    }
    
    @Override
    public List<Employee> findByActiveStatus(Boolean activeStatus) {
        return repository.findByActiveStatus(activeStatus);
    }
    
    @Override
    public List<Employee> findByRole(UserType role) {
        return repository.findByRole(role);
    }
    
    @Override
    public Employee save(Employee employee) {
        return repository.save(employee);
    }
    
    @Override
    public void deleteByUsername(String username) {
        repository.deleteById(username);
    }
    
    @Override
    public boolean existsByUsername(String username) {
        return repository.existsById(username);
    }
}
