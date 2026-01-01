package com.tastyfood.backend.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);
    
    @Value("${spring.datasource.url}")
    private String dataSourceUrl;
    
    @Value("${spring.datasource.username:}")
    private String username;
    
    @Value("${spring.datasource.password:}")
    private String password;
    
    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;
    
    @Bean
    @Primary
    public DataSource dataSource() {
        String jdbcUrl = dataSourceUrl;
        String dbUsername = username;
        String dbPassword = password;
        
        // Parse Render's postgresql:// format and convert to JDBC format
        if (jdbcUrl != null && jdbcUrl.startsWith("postgresql://")) {
            try {
                // Parse: postgresql://user:password@host:port/database
                String urlWithoutProtocol = jdbcUrl.substring("postgresql://".length());
                int atIndex = urlWithoutProtocol.indexOf('@');
                
                if (atIndex > 0) {
                    // Extract user:password
                    String userPass = urlWithoutProtocol.substring(0, atIndex);
                    int colonIndex = userPass.indexOf(':');
                    if (colonIndex > 0) {
                        dbUsername = userPass.substring(0, colonIndex);
                        dbPassword = userPass.substring(colonIndex + 1);
                    } else {
                        dbUsername = userPass;
                    }
                    
                    // Extract host:port/database
                    String hostDb = urlWithoutProtocol.substring(atIndex + 1);
                    int slashIndex = hostDb.indexOf('/');
                    String hostPort = slashIndex > 0 ? hostDb.substring(0, slashIndex) : hostDb;
                    String database = slashIndex > 0 ? hostDb.substring(slashIndex + 1) : "";
                    
                    // Parse host and port (Render may not include port in connection string)
                    int portColonIndex = hostPort.indexOf(':');
                    String host;
                    String port;
                    
                    if (portColonIndex > 0) {
                        host = hostPort.substring(0, portColonIndex);
                        port = hostPort.substring(portColonIndex + 1);
                    } else {
                        host = hostPort;
                        port = "5432"; // Default PostgreSQL port
                    }
                    
                    // Build JDBC URL: jdbc:postgresql://host:port/database
                    jdbcUrl = "jdbc:postgresql://" + host + ":" + port + "/" + database;
                    logger.info("Converted PostgreSQL URL to JDBC format");
                } else {
                    // Fallback: just prepend jdbc:
                    jdbcUrl = "jdbc:" + jdbcUrl;
                }
            } catch (Exception e) {
                logger.error("Error parsing PostgreSQL URL, using fallback: {}", e.getMessage());
                jdbcUrl = "jdbc:" + jdbcUrl;
            }
        }
        
        if (jdbcUrl == null) {
            throw new IllegalStateException("Database URL is not configured");
        }
        
        logger.info("Connecting to database: {}", jdbcUrl.replaceAll(":[^:@]+@", ":****@"));
        
        DataSourceBuilder<?> builder = DataSourceBuilder.create()
                .url(jdbcUrl)
                .driverClassName(driverClassName);
        
        // Set username and password if provided
        if (dbUsername != null && !dbUsername.isEmpty()) {
            builder.username(dbUsername);
        }
        if (dbPassword != null && !dbPassword.isEmpty()) {
            builder.password(dbPassword);
        }
        
        return builder.build();
    }
}
