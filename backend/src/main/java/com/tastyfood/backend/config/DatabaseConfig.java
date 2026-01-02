package com.tastyfood.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.net.URI;

/**
 * Configuration class to handle database connection, especially for Supabase PostgreSQL.
 * Converts Supabase connection string format to JDBC format if needed.
 */
@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url:}")
    private String databaseUrl;

    /**
     * Converts Supabase postgres:// URL to JDBC format if needed.
     * Supabase provides: postgres://user:pass@host:port/dbname
     * JDBC needs: jdbc:postgresql://host:port/dbname?user=user&password=pass
     */
    @Bean
    @Profile("prod")
    public String convertSupabaseUrl() {
        if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
            try {
                URI uri = new URI(databaseUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] credentials = userInfo.split(":");
                    String username = credentials[0];
                    String password = credentials.length > 1 ? credentials[1] : "";
                    
                    // URL decode password if needed
                    password = java.net.URLDecoder.decode(password, java.nio.charset.StandardCharsets.UTF_8);
                    
                    String host = uri.getHost();
                    int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                    String database = uri.getPath().substring(1); // Remove leading /
                    
                    // Build JDBC URL
                    String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s?user=%s&password=%s&sslmode=require",
                            host, port, database, username, password);
                    
                    System.setProperty("spring.datasource.url", jdbcUrl);
                    System.setProperty("spring.datasource.driver-class-name", "org.postgresql.Driver");
                    
                    return jdbcUrl;
                }
            } catch (Exception e) {
                System.err.println("Error converting Supabase URL: " + e.getMessage());
            }
        }
        return databaseUrl;
    }
}

