package com.tastyfood.backend.service;

import com.tastyfood.backend.dbinterface.DBInterfaceEmployees;
import com.tastyfood.backend.dbinterface.DBInterfaceLoginCredentials;
import com.tastyfood.backend.domain.Employee;
import com.tastyfood.backend.enums.UserType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private DBInterfaceEmployees dbInterface;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private DBInterfaceLoginCredentials loginCredentialsDbInterface;

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

    /**
     * Registers a new employee with auto-generated username and password.
     * Creates both employee record and login credentials.
     * 
     * @param firstName First name of the employee
     * @param lastName  Last name of the employee
     * @param password  Password for the employee
     * @param role      Role of the employee (defaults to STAFF if null)
     * @return Created Employee with generated username, or null if registration
     *         failed
     */
    public Employee registerNewEmployee(String firstName, String lastName, String password, UserType role) {
        // Convert UserType enum to lowercase string for database
        String userTypeStr = (role != null ? role : UserType.STAFF).name().toLowerCase();

        // Generate username and create login credentials
        String username = authenticationService.registerEmployee(firstName, lastName, password, userTypeStr);

        if (username == null) {
            return null; // Could not generate unique username
        }

        // Create employee record
        Employee employee = new Employee();
        employee.setUsername(username);
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setRole(role != null ? role : UserType.STAFF);
        employee.setActiveStatus(true);
        employee.setHireDate(LocalDate.now());
        employee.setLastActiveAt(Instant.now());

        return dbInterface.save(employee);
    }

    public Employee updateEmployee(Employee employee) {
        employee.setLastActiveAt(Instant.now());
        return dbInterface.save(employee);
    }

    @Transactional
    public boolean deleteEmployee(String username) {
        if (!dbInterface.existsByUsername(username)) {
            return false;
        }
        // Delete employee record
        dbInterface.deleteByUsername(username);
        // Also delete the corresponding login credentials
        if (loginCredentialsDbInterface.existsByUsername(username)) {
            loginCredentialsDbInterface.deleteByUsername(username);
        }
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
