package com.tastyfood.backend.dbinterface.impl;

import com.tastyfood.backend.dbinterface.DBInterfaceLoginCredentials;
import com.tastyfood.backend.domain.LoginCredentials;
import com.tastyfood.backend.repository.LoginCredentialsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DBInterfaceLoginCredentialsImpl implements DBInterfaceLoginCredentials {
    
    @Autowired
    private LoginCredentialsRepository repository;
    
    @Override
    public Optional<LoginCredentials> findByUsername(String username) {
        return repository.findByUsername(username);
    }
    
    @Override
    public LoginCredentials save(LoginCredentials credentials) {
        return repository.save(credentials);
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
