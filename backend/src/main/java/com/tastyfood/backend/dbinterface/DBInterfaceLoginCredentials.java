package com.tastyfood.backend.dbinterface;

import com.tastyfood.backend.domain.LoginCredentials;

import java.util.Optional;

public interface DBInterfaceLoginCredentials {
    Optional<LoginCredentials> findByUsername(String username);
    LoginCredentials save(LoginCredentials credentials);
    void deleteByUsername(String username);
    boolean existsByUsername(String username);
}
