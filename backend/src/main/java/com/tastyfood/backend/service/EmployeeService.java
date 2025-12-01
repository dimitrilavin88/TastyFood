package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceEmployees;
import com.tastyfood.backend.domain.Employee;
import com.tastyfood.backend.enums.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    
    @Autowired
    private DBInterfaceEmployees dbInterface;
    
    public Optional<Employee> getEmployeeByUsername(String username) {
        return dbInterface.findByUsername(username);
    }
    
    public List<Employee> getAllEmployees() {
        return dbInterface.findAll();
    }
    
    public List<Employee> getEmployeesByRole(UserType role) {
        return dbInterface.findByRole(role);
    }
    
    public List<Employee> getActiveEmployees() {
        return dbInterface.findByActiveStatus(true);
    }
    
    public Employee createEmployee(Employee employee) {
        if (employee.getHireDate() == null) {
            employee.setHireDate(LocalDate.now());
        }
        if (employee.getActiveStatus() == null) {
            employee.setActiveStatus(true);
        }
        employee.setLastActiveAt(Instant.now());
        return dbInterface.save(employee);
    }
    
    public Employee updateEmployee(Employee employee) {
        employee.setLastActiveAt(Instant.now());
        return dbInterface.save(employee);
    }
    
    public boolean deleteEmployee(String username) {
        if (!dbInterface.existsByUsername(username)) {
            return false;
        }
        dbInterface.deleteByUsername(username);
        return true;
    }
    
    public void updateLastActiveTime(String username) {
        Optional<Employee> employee = dbInterface.findByUsername(username);
        employee.ifPresent(emp -> {
            emp.setLastActiveAt(Instant.now());
            dbInterface.save(emp);
        });
    }
}
